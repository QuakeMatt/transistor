import { EasingFunction } from "../easing/EasingFunction";

/**
 * ...
 */
export class Easing {

    /**
     * ...
     */
    public readonly start: number;

    /**
     * ...
     */
    public readonly end: number;

    /**
     * ...
     */
    public readonly duration: number;

    /**
     * ...
     */
    public readonly strategy: EasingFunction;

    /**
     * ...
     *
     * @param start ...
     * @param duration ...
     * @param easing ...
     */
    constructor(start: number, duration: number, strategy: EasingFunction) {
        this.start = start;
        this.duration = duration;
        this.end = start + duration;
        this.strategy = strategy;
    }

    /**
     * ...
     *
     * @param time ...
     * @returns ...
     */
    ease(time: number): number {

        if (time <= this.start) {
            return 0.0;
        }

        if (time >= this.end) {
            return 1.0;
        }

        return this.strategy((time - this.start) / this.duration);

    }

}
