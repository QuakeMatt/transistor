const defaultTransition = createTransition({
    easing: 'ease',
    delay: 0,
    duration: 4000,
});

function createGraph(root, selector) {
}

function createChangeTracker(graph) {
}

function transistor(options, mutate) {

    const bundle = createBundle({
        options: options,
        transition: localTransition,
    });

    const localTransition = createTransition(options, defaultTransition);

    graph.forEach(function (element) {
        bundle.merge(element, {
            start: getTerminalSnapshot(element) ?? createSnapshotFromElement(element),
        });
    });

    function t(element, options, mutate) {
        const elementTransition = createTransition(options, localTransition);
        select(element).forEach(function (e) {
            bundle.merge(element, {
                options: options,
                transition: elementTransition,
            });
            mutate(e);
        });
        return elementTransition.promise;
    }

    mutate(t);

    graph.forEach(function (element) {
        bundle.merge(element, {
            end: createSnapshotFromElement(element),
        });
    });

    const wilbur = bundle.diff();

    return new Promise();

}
