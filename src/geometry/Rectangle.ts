export interface Rectangle {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export const IDENTITY_RECTANGLE = createRectangle(0.0, 0.0, 1.0, 1.0);

export function createRectangle(x: number, y: number, width: number, height: number): Rectangle {
    return { x, y, width, height };
}

export function createRectangleFromBounds(bounds: DOMRect): Rectangle {
    return createRectangle(bounds.x, bounds.y, bounds.width, bounds.height);
}

export function createRectangleFromElement(element: Element): Rectangle {
    return createRectangleFromBounds(element.getBoundingClientRect());
}
