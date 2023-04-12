import { IDENTITY_TRANSFORM, Transform, createTransform } from "../geometry/Transform";
import { createScheduler } from "../scheduler/FrameRequestScheduler";
import { Scheduler } from "../scheduler/Scheduler";
import { createKnownStates } from "../state/KnownStates";
import { createMutableDelta } from "../tween/Delta";
import { createTweenManager } from "../tween/TweenManager";
import { GraphNode, createGraph } from "./Graph";
import { Solver, createSolver } from "./Solver";

export type FlipFunction = () => void;

export interface Transistor {
    (mutate: FlipFunction): void;
    prepare(): void;
    execute(): void;
    flip(mutate: FlipFunction): void;
}

export interface TransistorOptions {
    root?: Element,
    scheduler?: Scheduler,
}

export function createTransistor(options: TransistorOptions = {}): Transistor {

    const graph = createGraph(options.root ?? document.documentElement);

    const tweenManager = createTweenManager();

    const knownStates = createKnownStates();

    const schedule = options.scheduler ?? createScheduler();

    let solver: Solver | undefined;

    return Object.assign(flip.bind(null), {
        prepare,
        execute,
        flip,
    });

    function transformNode(node: GraphNode, time: DOMHighResTimeStamp, carry: Transform): number {

        let activeTweens = 0;

        const element = node.element;
        const myTweens = tweenManager.get(element);
        // }

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

        element.setAttribute('style', `transform: translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${dw}, ${dh});`);

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

    function prepare(): void {

        if (solver) {
            throw new Error('Solver already active');
        }

        graph.forEach(n => n.element.setAttribute('style', '')); // FIXME

        solver = createSolver(graph, schedule(tick));

    }

    function execute(): void {

        if ( ! solver) {
            throw new Error('No active solver');
        }

        solver.solve(tweenManager, knownStates);
        solver = undefined;

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
