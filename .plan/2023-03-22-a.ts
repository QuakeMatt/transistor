interface Rectangle {}

type Snapshot = WeakMap<Element, SnapshotNode>;

interface SnapshotNode {
    element: Element;
    parent: Element;
    rectangle: Rectangle;
}

interface Tween {
    element: Element;

    dx: number;
    dy: number;
    dh: number;
    dw: number;
    time: number;

    start: Snapshot;
    end: Snapshot;
}
