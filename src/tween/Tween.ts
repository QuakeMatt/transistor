import { Easing } from "../easing/Easing";
import { MutableRectangle, Rectangle, createDeltaRectangle } from "../geometry/Rectangle";
import { SnapshotPair } from "../snapshot/SnapshotPair";
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

        console.group('reframing tween');
        console.log({tween: self, oldParent: self.parent, newParent: parent});

        const reframed = createTweenFromScene(
            self.element,
            parent,
            self.easing,
            self.snapshot,
        );

        console.log({reframed});

        if (reframed) {
            self.delta = reframed.delta;
        }

        console.groupEnd();

    }

}

export function createTweenFromScene(
    element: Element,
    parent: Element,
    easing: Easing,
    snapshot: SnapshotPair,
): Tween {

    /* */
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
    /* */

    /*
    const elementStartState = startSnapshot.get(element);
    if (null == elementStartState) {
        throw new Error('no elementStartState');
    }

    const elementFinalState = finalSnapshot.get(element);
    if (null == elementFinalState) {
        throw new Error('no elementFinalState');
    }

    const parentStartState = startSnapshot.get(parent);
    if (null == parentStartState) {
        throw new Error('no parentStartState');
    }

    const parentFinalState = finalSnapshot.get(parent);
    if (null == parentFinalState) {
        throw new Error('no parentFinalState');
    }

    const elementStartRectangle = elementStartState.rectangle;
    if (null == elementStartRectangle) {
        throw new Error('no elementStartRectangle');
    }

    const elementFinalRectangle = elementFinalState.rectangle;
    if (null == elementFinalRectangle) {
        throw new Error('no elementFinalRectangle');
    }

    const parentStartRectangle = parentStartState.rectangle;
    if (null == parentStartRectangle) {
        throw new Error('no parentStartRectangle');
    }

    const parentFinalRectangle = parentFinalState.rectangle;
    if (null == parentFinalRectangle) {
        throw new Error('no parentFinalRectangle');
    }

    // const parent = forceParent ?? elementFinalState.parent;
    // if (null == parent) {
    //     return undefined;
    // }

    // const startRectangle = elementStartState.relative;
    // if (null == startRectangle) {
    //     throw new Error('no startRectangle');
    // }

    // const finalRectangle = elementFinalState.relative;
    // if (null == finalRectangle) {
    //     throw new Error('no finalRectangle');
    // }

    const delta = createDelta(
        createDeltaRectangle(
            createRelativeRectangle(elementStartRectangle, parentStartRectangle),
            createRelativeRectangle(elementFinalRectangle, parentFinalRectangle),
        ),
    );

    return createTween(
        element,
        parent,
        delta,
        easing,
        scene,
    );
    /* */

}

function applyRectangleTween(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
    accumulator.x += progress * delta.x;
    accumulator.y += progress * delta.y;
    accumulator.width += progress * delta.width;
    accumulator.height += progress * delta.height;
}
