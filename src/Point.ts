export interface Point {
    readonly x: number;
    readonly y: number;
}

export function createPoint(x: number, y: number): Point {
    return { x, y };
}

export function createPointFromString(value: string): Point {
    const parts = value.split(' ');
    return createPoint(
        parseFloat(parts[0]),
        parseFloat(parts[1] ?? parts[0]),
    );
}
