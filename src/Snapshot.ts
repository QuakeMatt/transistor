import { createRectangle, createRectangleFromElement, Rectangle } from "./Rectangle";

export interface Snapshot {
    rectangle: Rectangle;
}

export function createSnapshot(rectangle: Rectangle): Snapshot {

    return {
        rectangle,
    };

}

export function createSnapshotFromElement(element: HTMLElement): Snapshot {

    const parent = element.parentElement;

    const elementRectangle = createRectangleFromElement(element);
    const parentRectangle = createRectangleFromElement(parent ?? element);

    return createSnapshot(
        createRectangle(
            elementRectangle.x - parentRectangle.x,
            elementRectangle.y - parentRectangle.y,
            elementRectangle.width,
            elementRectangle.height,
        ),
    );

}
