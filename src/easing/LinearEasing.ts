import { EasingFunction } from "./Easing";

export function createLinearEasing(): EasingFunction {
    return function (x: number): number {
        return x;
    };
}
