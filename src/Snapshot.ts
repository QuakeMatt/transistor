import { Rectangle, createRectangleFromElement } from "./geometry/Rectangle";

export type SnapshotsMap = Map<Element, Snapshot | undefined>;

export interface Snapshot {
    readonly rectangle: Rectangle;
    readonly parent: Rectangle;
}

export function createSnapshot(rectangle: Rectangle, parent: Rectangle): Snapshot {
    return {
        rectangle,
        parent,
    };
}

export function createSnapshotFromElement(element: Element, parent: Rectangle) {
    return createSnapshot(
        createRectangleFromElement(element),
        parent,
    );
}
