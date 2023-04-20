export function easeInSine(x: number): number {
    return 1.0 - Math.cos(x * Math.PI * 0.5);
}

export function easeOutSine(x: number): number {
    return Math.sin(x * Math.PI * 0.5);
}

export function easeInOutSine(x: number): number {
    return -0.5 * (Math.cos(Math.PI * x) - 1.0);
}
