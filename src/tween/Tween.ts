import { Easing } from "../easing/Easing";
import { MutableRectangle, Rectangle, createDeltaRectangle } from "../geometry/Rectangle";
import { Snapshot } from "../snapshot/Snapshot";
import { Delta, MutableDelta, createDelta } from "./Delta";

export interface Tween {
    readonly element: Element;
    readonly parent: Element;
    readonly delta: Delta;
    readonly easing: Easing;

    readonly startSnapshot: Snapshot;
    readonly finalSnapshot: Snapshot;

    apply(delta: MutableDelta, time: DOMHighResTimeStamp): void;
    reframe(parent: Element): void;
}

export function createTween(
    element: Element,
    parent: Element,
    delta: Delta,
    easing: Easing,

    startSnapshot: Snapshot,
    finalSnapshot: Snapshot,
): Tween {

    const self = {
        element,
        parent,
        delta,
        easing,

        startSnapshot,
        finalSnapshot,

        apply,
        reframe,
    };

    return self;

    function apply(accumulator: MutableDelta, time: DOMHighResTimeStamp): void {

        const progress = 1.0 - self.easing.ease(time);

        applyRectangleTween(accumulator.rectangle, self.delta.rectangle, progress);

    }

    function reframe(parent: Element): void {
    }

}

export function createTweenFromSnapshots(
    element: Element,
    easing: Easing,
    startSnapshot: Snapshot,
    finalSnapshot: Snapshot,
): Tween | undefined {

    const elementStartState = startSnapshot.get(element);
    if (null == elementStartState) {
        throw new Error('no elementStartState');
    }

    const elementFinalState = finalSnapshot.get(element);
    if (null == elementFinalState) {
        throw new Error('no elementFinalState');
    }

    const parent = elementFinalState.parent;
    if (null == parent) {
        return undefined;
    }

    const startRectangle = elementStartState.relative;
    if (null == startRectangle) {
        throw new Error('no startRectangle');
    }

    const finalRectangle = elementFinalState.relative;
    if (null == finalRectangle) {
        throw new Error('no finalRectangle');
    }

    const delta = createDelta(
        createDeltaRectangle(startRectangle, finalRectangle),
    );

    return createTween(
        element,
        parent,
        delta,
        easing,
        startSnapshot,
        finalSnapshot,
    );

}

function applyRectangleTween(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
    accumulator.x += progress * delta.x;
    accumulator.y += progress * delta.y;
    accumulator.width += progress * delta.width;
    accumulator.height += progress * delta.height;
}
