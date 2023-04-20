import { PartialConfig } from "../config/Config";
import { createDefaultConfigManager } from "../config/ConfigManager";
import { IDENTITY_TRANSFORM, Transform, createTransform } from "../geometry/Transform";
import { createScheduler } from "../scheduler/FrameRequestScheduler";
import { Scheduler } from "../scheduler/Scheduler";
import { createKnownStates } from "../state/KnownStates";
import { createMutableDelta } from "../tween/Delta";
import { createTweenManager } from "../tween/TweenManager";
import { GraphNode, createGraph } from "./Graph";
import { Solver, createSolver } from "./Solver";

export type FlipFunction = (transistor: Transistor) => void;

export interface Transistor {
    (mutate: FlipFunction): void;
    prepare(config?: PartialConfig): void;
    execute(config?: PartialConfig): Promise<Element[]>;
    flip(mutate: FlipFunction): Promise<Element[]>;
    configure(config: PartialConfig): Transistor;
    configure(elements: Element[], config: PartialConfig): Transistor;
}

export interface TransistorOptions {
    root?: Element;
    scheduler?: Scheduler;
    config?: PartialConfig;
}

export function createTransistor(options: TransistorOptions = {}): Transistor {

    const graph = createGraph(options.root ?? document.documentElement);

    const configManager = createDefaultConfigManager(options.config);

    const tweenManager = createTweenManager();

    const knownStates = createKnownStates();

    const schedule = options.scheduler ?? createScheduler();

    let solver: Solver | undefined;

    const self = Object.assign(flip.bind(null), {
        prepare,
        execute,
        flip,
        configure,
    });

    return self;

    function transformNode(node: GraphNode, time: DOMHighResTimeStamp, carry: Transform): number {

        let activeTweens = 0;

        const element = node.element;
        const myTweens = tweenManager.get(element);

        const myRectangle = knownStates.getRelativeRectangle(element);
        if (null == myRectangle) {
            throw new Error('no last-known rectangle');
        }

        const accumulator = createMutableDelta();

        myTweens.forEach(function (tween) {
            tween.apply(accumulator, time)
                ? (activeTweens += 1)
                : tweenManager.remove(tween);
        });

        const dw = (accumulator.rectangle.width + myRectangle.width) / myRectangle.width;
        const dh = (accumulator.rectangle.height + myRectangle.height) / myRectangle.height;

        const dx = accumulator.rectangle.x;
        const dy = accumulator.rectangle.y;

        const rw = 1.0 / carry.width;
        const rh = 1.0 / carry.height;

        const rx = myRectangle.x * (rw - 1.0);
        const ry = myRectangle.y * (rh - 1.0);

        // element.setAttribute('style', `transform: translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${dw}, ${dh});`);

        const transformAttr = `translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;

        (element instanceof HTMLElement)
            ? element.style.transform = transformAttr
            : element.setAttribute('style', `transform: ${transformAttr}`);

        const myTransform = createTransform(dx, dy, dw, dh);

        return activeTweens + transformNodeChildren(node, time, myTransform);

    }

    function transformNodeChildren(node: GraphNode, time: DOMHighResTimeStamp, carry: Transform): number {

        return node.children.reduce(function (activeTweens, node) {
            return activeTweens + transformNode(node, time, carry);
        }, 0);

    }

    function tick(time: DOMHighResTimeStamp): void {

        if (0 < transformNodeChildren(graph.getRoot(), time, IDENTITY_TRANSFORM)) {
            schedule(tick);
        }

    }

    function prepare(config?: PartialConfig): void {

        if (solver) {
            throw new Error('Solver already active');
        }

        graph.forEach(function (node) {
            const element = node.element;
            (element instanceof HTMLElement)
                ? element.style.transform = ''
                : element.setAttribute('style', '');
        });

        solver = createSolver(graph, configManager.clone(config), schedule(tick));

    }

    function execute(config?: PartialConfig): Promise<Element[]> {

        if ( ! solver) {
            throw new Error('No active solver');
        }

        const tweens = solver.solve(tweenManager, knownStates);
        const time = solver.time;
        solver = undefined;

        tick(time);

        return Promise.all(tweens);

    }

    function configure(config: PartialConfig): Transistor;
    function configure(elements: Element | Element[], config: PartialConfig): Transistor;
    function configure(elements: Element | Iterable<Element> | PartialConfig | undefined, config?: PartialConfig): Transistor {

        let cm = solver ? solver.config : configManager;

        if (null == elements) {
            throw new Error('no u');
        }

        if (elements instanceof Element) {
            if (null == config) {
                throw new Error('no u');
            }
            cm.configureElements([elements], config);
            // elements = [elements];
            // // const wah = elements;
        }

        else if (Symbol.iterator in elements) {
            if (null == config) {
                throw new Error('no u');
            }
            cm.configureElements(elements, config);
            // const bah = elements;
        }

        else {
            cm.configure(elements);
            // config = elements;
            // elements = undefined;
        }

        return self;

    }

    function flip(mutate: FlipFunction): Promise<Element[]> {
        prepare();
        mutate(self);
        return execute();
    }

}
