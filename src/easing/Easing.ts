import { EasingFunction } from "./EasingFunction";

export interface Easing {
    readonly start: DOMHighResTimeStamp;
    readonly duration: number;
    readonly strategy: EasingFunction,
    ease(time: DOMHighResTimeStamp): number;
}

export function createEasing(start: DOMHighResTimeStamp, duration: number, strategy: EasingFunction): Easing {

    const end = start + duration;

    return {
        start,
        duration,
        strategy,
        ease,
    };

    function ease(time: DOMHighResTimeStamp): number {

        if (time <= start) {
            return 0.0;
        }

        if (time >= end) {
            return 1.0;
        }

        return strategy((time - start) / duration);
    }

}
