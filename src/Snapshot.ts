import { createPointFromString, Point } from "./Point";
import { createRectangleFromElement, Rectangle } from "./Rectangle";

export interface Snapshot {
    rectangle: Rectangle;
    opacity: number,
    origin: Point;
}

export function createSnapshot(rectangle: Rectangle, opacity: number, origin: Point): Snapshot {

    return {
        rectangle,
        opacity,
        origin,
    };

}

export function createSnapshotFromElement(element: HTMLElement): Snapshot {

    const style = getComputedStyle(element);

    return createSnapshot(
        createRectangleFromElement(element),
        parseFloat(style.opacity),
        createPointFromString(style.transformOrigin),
    );

}
