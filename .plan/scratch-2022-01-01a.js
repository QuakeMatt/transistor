/**
 * ...
 */
function createGraph(root) {
}

/**
 * ...
 */
function createProcess() {
}

// /**
//  * ...
//  */
// function createRuntime(graph) {

//     const processes = [];

//     export function reset() {
//     }

//     export function createProcess() {
//         reset();
//         const process = createProcess(graph);
//     }

//     function tick() {
//         requestAnimationFrame(tick);
//     }

//     requestAnimationFrame(tick);
// }

/**
 * ...
 */
function createSnapshot(element) {
    return element.getBoundingClientRect();
}

/**
 * ...
 */
function createTransistor() {

    const graph = createGraph(document.body);
    const processes = [];

    let rAQID = 0;

    function resetElement(element) {
        element.style.transform = null;
    }

    function activate(process) {
        process && processes.push(process);
        rAQID || (rAQID = requestAnimationFrame(tick));
    }

    function tick() {

    }

    export function flip(fn) {

        graph.forEach(resetElement);
        const process = createProcess(graph);
        const promise = process.mutate(fn);
        activate(process);
        return promise;

    }
}
