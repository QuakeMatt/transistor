import { createAnimator } from "./Animator";
import { createGraph } from "./Graph";
import { TweenCollection } from "./Tween";
import { TweenBuilder, createTweenBuilder } from "./TweenBuilder";

export type FlipFunction = () => void;

export interface Transistor {
    (mutate: FlipFunction): void;
    readonly prepare: () => void;
    readonly execute: () => void;
    readonly flip: (mutate: FlipFunction) => void;
}

export interface TransistorOptions {
    root?: HTMLElement,
    // timer?: Function,
}

const FREEZE = false;

export function createTransistor(options: TransistorOptions = {}): Transistor {

    const graph = createGraph(options.root ?? document.documentElement);

    const tweens: TweenCollection = new WeakMap();

    const animator = createAnimator(graph, tweens);

    let builder: TweenBuilder | undefined;

    let now: number = performance.now();

    requestAnimationFrame(function _tick(time: number) {
        FREEZE ? (time = 0.0) :
        tick(now = time);
        requestAnimationFrame(_tick);
    });

    return Object.assign(flip.bind(null), {
        prepare,
        execute,
        flip,
    });

    function tick(time: number) {

        animator.tick(time);

        // console.log(graph.getRoot());
        // graph.forEach(function (node) {
        //     console.log({node});
        // });
    }

    function prepare(): void {

        if (builder) {
            throw new Error('build already active');
        }

        animator.reset();
        builder = createTweenBuilder(graph);

    }

    function execute(): void {

        if ( ! builder) {
            throw new Error('no active builder');
        }

        builder.build(tweens, now);
        builder = undefined;

        // console.log(tweens);
        FREEZE && tick(0);

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
