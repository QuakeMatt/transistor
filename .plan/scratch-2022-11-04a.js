function createGraph() {

    return {
        forEach,
    };

}

function createProcess(graph) {

    function createSnapshots() {
        const snapshots = new Set();
        graph.forEach(function (node) {
            snapshots[node.element] = createSnapshot(node.element);
        });
        return snapshots;
    }

    const startSnapshots = createSnapshots();

    return {};

}

function createTransistor() {

    const graph = createGraph();
    const processes = [];

    function flip(mutate) {

        const process = createProcess(graph);

        processes.push(process);

        // const startSnapshots = {};
        // const finalSnapshots = {};

        // graph.forEach(function (node) {
        //     startSnapshots[node.element] = createSnapshot(node.element);
        //     finalSnapshots[node.element] = null;
        // });

        // mutate();

        // graph.forEach(function (node) {
        //     finalSnapshots[node.element] = createSnapshot(node.element);
        // });

    }

    return {
        flip,
    };

}
