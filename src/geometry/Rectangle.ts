export interface Rectangle {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface MutableRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function createRectangle(x: number, y: number, width: number, height: number): Rectangle {
    return new DOMRect(x, y, width, height);
}

export function createRelativeRectangle(rectangle: Rectangle, parent: Rectangle): Rectangle {
    return createRectangle(
        rectangle.x - parent.x,
        rectangle.y - parent.y,
        rectangle.width,
        rectangle.height,
    );
}

export function createDeltaRectangle(start: Rectangle, final: Rectangle): Rectangle {
    return createRectangle(
        start.x - final.x,
        start.y - final.y,
        start.width - final.width,
        start.height - final.height,
    );
}

export function createMutableRectangle(x?: number, y?: number, width?: number, height?: number): MutableRectangle {
    return createRectangle(x ?? 0.0, y ?? 0.0, width ?? 0.0, height ?? 0.0);
}

export function createRectangleFromElement(element: Element): Rectangle | undefined {
    const rect = element.getBoundingClientRect();
    return (0.0 === rect.x && 0.0 === rect.y && 0.0 === rect.width && 0.0 === rect.height) ? undefined : rect;
    // if (0.0 === rect.x && 0.0 === rect.y && 0.0 === rect.width && 0.0 === rect.height) {
    //     return undefined;
    // }
    // return createRectangle(
    //     Math.round(rect.x),
    //     Math.round(rect.y),
    //     Math.round(rect.width),
    //     Math.round(rect.height),
    // );
}
