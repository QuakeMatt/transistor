import { EasingFunction } from "../EasingFunction";

function linearEasing(x: number): number {
    return x;
}

export function createLinearEasing(): EasingFunction {
    return linearEasing;
}
