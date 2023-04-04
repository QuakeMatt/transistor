import { Rectangle, createRectangleFromElement } from "./geometry/Rectangle";

export type SnapshotsMap = Map<Element, Snapshot | undefined>;

export interface Snapshot {
    readonly rectangle: Rectangle;
    readonly parent: Rectangle;
    readonly parentElement: Element;
}

export function createSnapshot(rectangle: Rectangle, parent: Rectangle, parentElement: Element): Snapshot {
    return {
        rectangle,
        parent,
        parentElement,
    };
}

export function createSnapshotFromElement(element: Element, parent: Element): Snapshot {
    return createSnapshot(
        createRectangleFromElement(element),
        createRectangleFromElement(parent),
        parent,
    );
}

// ---

export interface SnaptshotNode {
    /* element: Element, */
    parent: Element | undefined;
    rectangle: DOMRect;
}

export type Snaptshot = WeakMap<Element, SnaptshotNode>;

export function createSnaptshot(): Snaptshot {
    return new Map();
}

export function createSnaptshotNode(element: Element, parent?: Element): SnaptshotNode {
    return {
        /* element, */
        parent,
        rectangle: element.getBoundingClientRect(),
    };
}
