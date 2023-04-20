export function easeInCubic(x: number): number {
    return x * x * x;
}

export function easeOutCubic(x: number): number {
    return 1.0 - easeInCubic(1.0 - x);
}

export function easeInOutCubic(x: number): number {
    return ((x *= 2.0) < 1.0)
        ? easeInCubic(x) * 0.5
        : easeOutCubic(x - 1.0) * 0.5 + 0.5;
}
