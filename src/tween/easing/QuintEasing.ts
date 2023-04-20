export function easeInQuint(x: number): number {
    return x * x * x * x * x;
}

export function easeOutQuint(x: number): number {
    return 1.0 - easeInQuint(1.0 - x);
}

export function easeInOutQuint(x: number): number {
    return ((x *= 2.0) < 1.0)
        ? easeInQuint(x) * 0.5
        : easeOutQuint(x - 1.0) * 0.5 + 0.5;
}
