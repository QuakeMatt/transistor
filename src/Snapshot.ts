import { createPointFromString, Point } from "./Point";
import { createRectangleFromElement, Rectangle } from "./Rectangle";

export interface Snapshot {
    rectangle: Rectangle;
    origin: Point;
}

export function createSnapshot(element: HTMLElement): Snapshot {

    const style = getComputedStyle(element);

    return {
        rectangle: createRectangleFromElement(element),
        origin: createPointFromString(style.transformOrigin),
    };

}
