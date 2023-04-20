import { Config } from "../config/Config";
import { EasingFunction } from "./EasingFunction";
import { createBezierEasing } from "./easing/BezierEasing";

export interface Easing {
    readonly start: DOMHighResTimeStamp;
    readonly end: number;
    readonly duration: number;
    readonly strategy: EasingFunction,
    ease(time: DOMHighResTimeStamp): number;
}

export function createEasing(start: DOMHighResTimeStamp, duration: number, strategy: EasingFunction): Easing {

    const end = start + duration;

    return {
        start,
        end,
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

export function createEasingFromConfig(time: DOMHighResTimeStamp, config: Config) {

    return createEasing(
        time + config.delay,
        config.duration,
        createBezierEasing(0.25, 0.1, 0.25, 1.0),
    );

}
