import { Easing } from "../easing/Easing";
import { MutableRectangle, Rectangle, createDeltaRectangle } from "../geometry/Rectangle";
import { SnapshotPair } from "../state/SnapshotPair";
import { Delta, MutableDelta, createDelta } from "./Delta";

export interface Tween {
    readonly element: Element;
    readonly parent: Element;
    readonly delta: Delta;
    readonly easing: Easing;
    readonly snapshot: SnapshotPair;

    apply(delta: MutableDelta, time: DOMHighResTimeStamp): boolean;
    reframe(parent: Element): void;
}

export function createTween(
    element: Element,
    parent: Element,
    delta: Delta,
    easing: Easing,
    snapshot: SnapshotPair,
): Tween {

    const self = {
        element,
        parent,
        delta,
        easing,
        snapshot,
        apply,
        reframe,
    };

    return self;

    function apply(accumulator: MutableDelta, time: DOMHighResTimeStamp): boolean {

        if (time >= self.easing.end) {
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

        const reframed = createTweenFromScene(
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

export function createTweenFromScene(
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
