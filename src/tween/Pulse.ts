import { MutableRectangle, Rectangle, createRectangle } from "../geometry/Rectangle";
import { SnapshotPair } from "../state/SnapshotPair";
import { MutableDelta, createDelta } from "./Delta";
import { Tween } from "./Tween";

export interface Pulse extends Tween {
}

export function createPulse(
    element: Element,
    tween: Tween,
    snapshot: SnapshotPair,
): Pulse {

    // console.log('createPulse', {element, tween});

    const easing = tween.easing;

    const wah = createDelta(
        createRectangle(
            tween.delta.rectangle.y * -0.1,
            tween.delta.rectangle.x * 0.1,
            0.0,
            0.0,
        )
    );

    const rect = snapshot.end.get(element)?.rectangle;
    if ( ! rect) {
        throw new Error('no rect');
    }

    const scale = (tween.delta.rectangle.x + tween.delta.rectangle.y) * -0.001;
    const delta = createDelta(
        createRectangle(
            rect.width * scale * -0.5 + wah.rectangle.x,
            rect.width * scale * -0.5 + wah.rectangle.y,
            rect.width * scale,
            rect.height * scale,
        )
    );

    let resolve: (value: Element) => void;

    const promise = new Promise<Element>(function (_resolve) {
        resolve = _resolve;
    });

    const self = {
        element,
        delta,
        easing,
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

        const progress = Math.sin(self.easing.ease(time) * Math.PI);

        // accumulator.rectangle.width

        // const progress = 1.0 - self.easing.ease(time);

        applyRectangleTween(accumulator.rectangle, self.delta.rectangle, progress);

        return true;

    }

    function reframe(parent: Element): void {}

}

function applyRectangleTween(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
    accumulator.x += progress * delta.x;
    accumulator.y += progress * delta.y;
    accumulator.width += progress * delta.width;
    accumulator.height += progress * delta.height;
}
