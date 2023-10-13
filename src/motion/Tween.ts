import { SnapshotPair } from "../state/SnapshotPair";
import { Delta } from "./Delta";
import { Easing } from "./Easing";
import { Motion } from "./Motion";

export class Tween extends Motion {

    constructor(element: Element, parent: Element, easing: Easing, snapshot: SnapshotPair) {

        const delta = new Delta(
            snapshot.end.getRelativeRectangle(element).getDelta(
                snapshot.start.getRelativeRectangle(element)
            ),
        );

        super(element, delta, easing);

    }

    // apply(accumulator: MutableDelta, time: DOMHighResTimeStamp): boolean {

    //     // if (time >= this.easing.end) {
    //     //     resolve(self.element);
    //     //     return false;
    //     // }

    //     const progress = 1.0 - this.easing.ease(time);

    //     applyRectangleTween(accumulator.rectangle, this.delta.rectangle, progress);

    //     return true;

    // }

}

// function applyRectangleTween(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
//     accumulator.x += progress * delta.x;
//     accumulator.y += progress * delta.y;
//     accumulator.width += progress * delta.width;
//     accumulator.height += progress * delta.height;
// }
