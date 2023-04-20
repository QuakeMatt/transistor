export function easeInQuart(x: number): number {
    return x * x * x * x;
}

export function easeOutQuart(x: number): number {
    return 1.0 - easeInQuart(1.0 - x);
}

export function easeInOutQuart(x: number): number {
    return ((x *= 2.0) < 1.0)
        ? easeInQuart(x) * 0.5
        : easeOutQuart(x - 1.0) * 0.5 + 0.5;
}
