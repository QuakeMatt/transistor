import { MutableRectangle } from "../primitive/MutableRectangle";
import { Rectangle } from "../primitive/Rectangle";
import { Delta } from "./Delta";

export interface Accumulator extends Delta {
    readonly rectangle: MutableRectangle;
}

export class Accumulator extends Delta {

    constructor() {
        super(new Rectangle());
    }

    accumulate(delta: Delta, progress: number): this {
        accumulateRectangle(this.rectangle, delta.rectangle, progress);
        return this;
    }

}

function accumulateRectangle(accumulator: MutableRectangle, delta: Rectangle, progress: number): void {
    accumulator.x += progress * delta.x;
    accumulator.y += progress * delta.y;
    accumulator.width += progress * delta.width;
    accumulator.height += progress * delta.height;
}
