import { Accumulator } from "./Accumulator";
import { Delta } from "./Delta";
import { Easing } from "./Easing";

export abstract class Motion {

    public readonly element: Element;

    public readonly delta: Delta;

    public readonly easing: Easing;

    constructor(element: Element, delta: Delta, easing: Easing) {
        this.element = element;
        this.delta = delta;
        this.easing = easing;
    }

    apply(accumulator: Accumulator, time: number): boolean {

        const progress = 1.0 - this.easing.ease(time);

        accumulator.accumulate(this.delta, progress);
        return true;

    }

}
