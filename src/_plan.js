function createRectangle(x, y, width, height) {
    return { x, y, width, height };
}

function createTransform(x, y, width, height) {
    return { x, y, width, height };
}

function createSnapshot(element) {
    return {
        rectangle: createRectangle(element),
        transform: createTransform(element),
    };
}

function createGraph(root, selector) {

    let elements = null;

    function build() {

        const parentMapping = new Map();
        const parentStack = [root];

        root.querySelectorAll(selector).forEach(function (element) {

            while (true) {
                const parent = parentStack[parentStack.length - 1];
                if (element === root || parent.contains(element)) {
                    break;
                } else {
                    parentStack.pop();
                }
            }

            parentMapping.set(element, parent);
            parentStack.push(element);

        });

        return parentMapping;

    }

    return {
        walk: function (fn) {
            (elements ?? (elements = build())).forEach(function (parent, element) {
                fn(element, parent);
            });
        },
    };

}

function createChangeTracker(graph, state) {

    const initial = new Map();

    graph.walk(function (element) {
        const snapshot = state.get(element)?.targetSnapshot ?? createSnapshot(element);
        diff.set(element, [snapshot, null]);
    });

    function compare() {
        graph.walk(function (element, parent) {
            const snapshot = createSnapshot(element);
            diff.has(element)
                ? diff.get(element)[1] = snapshot
                : diff.set(element, [null, snapshot]);
        });

    }

    return {};

}

function createTransistor(root) {

    const graph = createGraph(root, '[data-transistor]');
    const state = new WeakMap();

    return {
        flip: function (fn) {
            createChangeTracker(graph, state);
            fn();
        }
    };

}
