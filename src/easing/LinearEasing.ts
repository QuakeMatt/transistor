import { EasingFunction } from "./EasingFunction";

export function linearEasing(x: number): number {
    return x;
}

export function createLinearEasing(): EasingFunction {
    return linearEasing;
}
