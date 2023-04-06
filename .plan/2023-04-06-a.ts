interface Snapshot {
    get(element: Element): State | undefined;
    has(element: Element): boolean;
}

interface State {
    element: Element;
    parent: Element | undefined;
    relative: Rectangle | undefined;
    absolute: Rectangle | undefined;
    opacity: number;
    display: string;
}

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Tween {
    element: Element;
    parent: Element;
    delta: Delta;
    easing: Easing;

    start: Snapshot;
    final: Snapshot;

    apply(target: Delta, time: number): void;
    reframe(parent: Element): void;
}

interface Delta {
    rectangle: Rectangle;
    opacity: number;
}

interface Easing {
    start: number;
    duration: number;
    strategy: Function;

    get(time: number): number;
}

const knownStates = new WeakMap<Element, State>();
