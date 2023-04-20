export function easeInQuad(x: number): number {
    return x * x;
}

export function easeOutQuad(x: number): number {
    return 1.0 - easeInQuad(1.0 - x);
}

export function easeInOutQuad(x: number): number {
    return ((x *= 2.0) < 1.0)
        ? easeInQuad(x) * 0.5
        : easeOutQuad(x - 1.0) * 0.5 + 0.5;
}
