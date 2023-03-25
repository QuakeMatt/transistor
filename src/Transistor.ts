import { createAnimator } from "./Animator";
import { createGraph } from "./Graph";
import { TimerFactory, createTimer } from "./Timer";
import { TweenCollection } from "./Tween";
import { TweenBuilder, createTweenBuilder } from "./TweenBuilder";

export type FlipFunction = () => void;

export interface Transistor {
    (mutate: FlipFunction): void;
    prepare(): void;
    execute(): void;
    flip(mutate: FlipFunction): void;
}

export interface TransistorOptions {
    root?: Element,
    timer?: TimerFactory,
}

export function createTransistor(options: TransistorOptions = {}): Transistor {

    const graph = createGraph(options.root ?? document.documentElement);

    const tweens: TweenCollection = new WeakMap();

    const animator = createAnimator(graph, tweens);

    let builder: TweenBuilder | undefined;

    let time: number = (options.timer ?? createTimer)(tick);

    return Object.assign(flip.bind(null), {
        prepare,
        execute,
        flip,
    });

    function tick(_time: number): void {

        animator.tick(time = _time);

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

        builder.build(tweens, time);
        builder = undefined;

        // console.log(tweens);
        // FREEZE && tick(0);

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
