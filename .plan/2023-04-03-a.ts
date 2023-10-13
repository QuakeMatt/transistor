class DOMTree {
    constructor(root: Element) {}
    forEach(callbackfn: Function) {}
}

class Transistor {

    tree: DOMTree;

    tracker: ChangeTracker;

    constructor() {
        this.tree = new DOMTree(document.documentElement);
    }

    prepare() {
        this.tracker = new ChangeTracker(this.tree);
    }

    execute() {
        this.tracker.execute();
    }
}

class ChangeTracker {

    tree: DOMTree;

    elements: Set<Element>;

    first: Map<Element, Snapshot>;
    last: Map<Element, Snapshot>;

    constructor(tree: DOMTree) {
        this.tree = tree;
        this.elements = new Set();
        tree.forEach(function (node) {
            this.first.add(node.element, new Snapshot(node));
            this.elements.add(node.element);
        });
    }

    execute() {

        this.tree.forEach(function (node) {
            this.last.add(node.element, new Snapshot(node));
            this.elements.add(node.element);
        });

        this.elements.forEach(function (element) {
            const first = this.first.get(element);
            const last = this.last.get(element);

            tweens.reframe(element, last.parent);
            tweens.add(element, new Tween(element, first, last));

            rectangles.set(element, last.rectangle);
        });
    }
}

// class SnapshotNode {
//     element: Element;
//     parent: Element;
//     state: State;
// }

class Tween {
    element: Element;
    parent: Element;
    delta: Delta;
    easing: Easing;

    first: Snapshot;
    last: Snapshot;

    reframe(target: Element) {
        this.parent = target;
        this.delta = new Delta();
    }

    transform(time: number, delta?: Delta) {
        delta ??= new Delta();
        return delta;
    }
}

class State {
    /* x: number; */
    /* y: number; */
    /* width: number; */
    /* height: number; */
    rectangle: DOMRect;
    opacity: number;
}

type Delta = State;

class Easing {
    start: number;
    duration: number;
    easing: Function;
}
