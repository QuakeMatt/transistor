// // import { Transition } from "./Transition";

import { Graph, createGraph } from "./Graph";
import { Rectangle, createRectangleFromElement } from "./Rectangle";

// import { Graph } from "./Graph";

// type FlipFunction = () => void;

// class Snapshot {
// }

// class Snapshotter {



//     constructor(private readonly graph: Graph) {

//         graph.forEach(element => );

//     }

//     compare() {
//     }
// }

// export class Transistor {

//     // private readonly root: Element;
//     // readonly transitions: Map<Element, Transition[]>;

//     private readonly graph: Graph;

//     constructor(root: Element) {

//         this.graph = new Graph(root, '[data-transistor]');

//         // this.root = root;
//         // const transitions = this.transitions = new Map();
//         // root.querySelectorAll('[data-transistor]').forEach(function (element) {
//         //     transitions.set(element, []);
//         // });

//     }

//     flip(fn: FlipFunction): Promise<void> {

//         const snapshotter = new Snapshotter(this.graph);
//         fn();
//         console.log(snapshotter.compare());

//         return new Promise(function (resolve) {
//             setTimeout(function () {
//                 resolve();
//             }, 1000);
//         });
//     }
// }




interface Snapshot {
    rectangle: Rectangle,
}

function createSnapshotFromElement(element: Element): Snapshot {
    return {
        rectangle: createRectangleFromElement(element),
    };
}






interface ChangeSet {
    // changes:
}

function createChangeSet(initial: SnapshotMap, final: SnapshotMap): ChangeSet {

    initial.forEach(function (initialSnapshot, element) {
        const finalSnapshot = final.get(element);
        console.log(element, initialSnapshot.rectangle, finalSnapshot?.rectangle);
    });

    return {

    };
}








type SnapshotMap = Map<Element, Snapshot>;

interface ChangeTracker {
    compare: () => ChangeSet;
}

function createChangeTracker(graph: Graph): ChangeTracker {

    const initial: SnapshotMap = takeSnapshots();

    function takeSnapshots(): SnapshotMap {
        const snapshots: SnapshotMap = new Map();
        graph.forEach(function (node) {
            const element = node.element;
            snapshots.set(element, createSnapshotFromElement(element));
        });
        return snapshots;
    }

    function compare(): ChangeSet {
        return createChangeSet(initial, takeSnapshots());
    }

    return {
        compare,
    };
}






export type FlipFunction = () => void;

export interface Transistor {
    flip: (fn: FlipFunction) => Promise<void>;
}

export function createTransistor(root: Element): Transistor {

    const graph = createGraph(root, '[data-transistor]');

    function flip(fn: FlipFunction): Promise<void> {

        const tracker = createChangeTracker(graph);
        fn();
        const changes = tracker.compare();
        console.log(changes);

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });

    }

    return {
        flip,
    };

}
