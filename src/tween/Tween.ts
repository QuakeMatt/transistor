import { MutableRectangle, Rectangle, createDeltaRectangle } from "../geometry/Rectangle";
import { SnapshotPair } from "../state/SnapshotPair";
import { Delta, MutableDelta, createDelta } from "./Delta";
import { Easing } from "./Easing";

export interface Tween {
    readonly element: Element;
    /* readonly parent: Element; */
    readonly delta: Delta;
    readonly easing: Easing;
    /* readonly snapshot: SnapshotPair; */
    readonly snapshot?: SnapshotPair;

    apply(delta: MutableDelta, time: DOMHighResTimeStamp): boolean;
    reframe(parent: Element): void;
    then<T>(onfulfilled: (value: Element) => T | PromiseLike<T>): Promise<T>;
}

export function createTween(
    element: Element,
    parent: Element,
    delta: Delta,
    easing: Easing,
    snapshot: SnapshotPair,
): Tween {

    let resolve: (value: Element) => void;

    const promise = new Promise<Element>(function (_resolve) {
        resolve = _resolve;
    });

    const self = {
        element,
        parent,
        delta,
        easing,
        snapshot,
        apply,
        reframe,
        then: promise.then.bind(promise),
    };

    return self;

    function apply(accumulator: MutableDelta, time: DOMHighResTimeStamp): boolean {

        if (time >= self.easing.end) {
            resolve(self.element);
            return false;
        }

        const progress = 1.0 - self.easing.ease(time);

        applyRectangleTween(accumulator.rectangle, self.delta.rectangle, progress);

        return true;

    }

    function reframe(parent: Element): void {

        if (parent === self.parent) {
            return;
        }

        const reframed = createTweenFromSnapshot(
            self.element,
            parent,
            self.easing,
            self.snapshot,
        );

        if (reframed) {
            self.delta = reframed.delta;
        }

    }

}

export function createTweenFromSnapshot(
    element: Element,
    parent: Element,
    easing: Easing,
    snapshot: SnapshotPair,
): Tween {

    return createTween(
        element,
        parent,
        createDelta(
            createDeltaRectangle(
                snapshot.start.getRelativeRectangle(element, parent),
                snapshot.end.getRelativeRectangle(element, parent),
            ),
        ),
        easing,
        snapshot,
    );

}

function applyRectangleTween(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
    accumulator.x += progress * delta.x;
    accumulator.y += progress * delta.y;
    accumulator.width += progress * delta.width;
    accumulator.height += progress * delta.height;
}
