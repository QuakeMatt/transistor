interface Easing {}
interface Delta {}
interface Rectangle {}

// ----------------------

// interface KnownStates {
//     set(element: Element, state: State | undefined): KnownStates;
//     get(element: Element): State | undefined;
//     has(element: Element): boolean;
// }

interface Snapshot {
    get(element: Element): State | undefined;
    has(element: Element): boolean;
}

interface State {
    element: Element;
    parent: Element | undefined;

    rectangle: Rectangle | undefined;
    /* absolute: Rectangle | undefined; */
    /* relative: Rectangle | undefined; */
    display: string;
    opacity: number;
}

// ----------------------

interface Scene {
    start: Snapshot;
    end: Snapshot;
}

interface Snapshot {
    get(element: Element): State | undefined;
    has(element: Element): boolean;

    getRelativeRectangle(element: Element, parent?: Element): Rectangle;
}

interface MutableSnapshot extends Snapshot {
    set(element: Element, state: State | undefined): Snapshot;
}

interface Tween {
    element: Element;
    parent: Element;
    delta: Delta;
    easing: Easing;
    scene: Scene;
}

type KnownStates = MutableSnapshot;
