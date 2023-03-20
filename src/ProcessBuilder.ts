import { Graph, GraphNode } from "./Graph";
import { createProcess, Process } from "./Process";
import { createRectangle, createRectangleFromElement, Rectangle } from "./Rectangle";
import { createSnapshot, createSnapshotFromElement, Snapshot } from "./Snapshot";
import { SnapshotsMap } from "./SnapshotsMap";
import { createTween, TweenMap } from "./Tween";

export interface ProcessBuilder {
    build: (time: DOMHighResTimeStamp) => Process;
}

export function createProcessBuilder(graph: Graph): ProcessBuilder {

    const startSnapshots: SnapshotsMap = new Map();
    const finalSnapshots: SnapshotsMap = new Map();

    graph.forEach(function (node) {
        startSnapshots.set(node.element, createSnapshotFromElement(node.element));
        finalSnapshots.set(node.element, undefined);
    });

    return {
        build,
    };

    function build(time: DOMHighResTimeStamp): Process {

        graph.forEach(function (node) {
            finalSnapshots.set(node.element, createSnapshotFromElement(node.element));
        });

        // graph.getRoot()

        // bimble(graph.getRoot());

        // function bimble(node: GraphNode, parentRectangle: Rectangle) {

        //     const element = node.element;

        //     const startSnapshot = startSnapshots.get(element);
        //     if (null == startSnapshot) {
        //         throw new Error('should not happen');
        //     }

        //     const finalSnapshot = createSnapshotFromElement(element);

        //     // console.log('absolute', {
        //     //     startSnapshot,
        //     //     finalSnapshot,
        //     // });

        //     const myRectangle = finalSnapshot.rectangle;

        //     // finalSnapshot.rectangle = createRectangle(
        //     //     finalSnapshot.rectangle.x - parentRectangle.x,
        //     //     finalSnapshot.rectangle.y - parentRectangle.y,
        //     //     finalSnapshot.rectangle.width,
        //     //     finalSnapshot.rectangle.height,
        //     // );

        //     // startSnapshot.rectangle = createRectangle(
        //     //     startSnapshot.rectangle.x - parentRectangle.x,
        //     //     startSnapshot.rectangle.y - parentRectangle.y,
        //     //     startSnapshot.rectangle.width,
        //     //     startSnapshot.rectangle.height,
        //     // );

        //     // console.log('relative', {
        //     //     startSnapshot,
        //     //     finalSnapshot,
        //     // });

        //     startSnapshots.set(element, startSnapshot);
        //     finalSnapshots.set(element, finalSnapshot);

        //     node.children.forEach(child => bimble(child, myRectangle));
        // }

        // bimble(
        //     graph.getRoot(),
        //     createRectangleFromElement(graph.getRoot().element)
        // );

        return createProcess(time, graph, createTweens());

    }

    function createTweens(): TweenMap {

        const tweens: TweenMap = new Map();

        for (const element of finalSnapshots.keys()) {

            const startSnapshot = startSnapshots.get(element);
            if (null == startSnapshot) {
                continue;
            }

            const finalSnapshot = finalSnapshots.get(element);
            if (null == finalSnapshot) {
                continue;
            }

            // const parentElement = element.parentElement;
            // if (null == parentElement) {
            //     continue;
            // }

            // const parentRectangle = createRectangleFromElement(parentElement);

            // const dx = finalSnapshot.rectangle.x - parentRectangle.x;

            // finalSnapshot.rectangle = createRectangle(
            //     finalSnapshot.rectangle.x - parentRectangle.x,
            //     finalSnapshot.rectangle.y - parentRectangle.y,
            //     finalSnapshot.rectangle.width,
            //     finalSnapshot.rectangle.height,
            // );

            // const startSnapshot = extrapolateSnapshot(finalSnapshot, startSnapshots.get(element));

            // startSnapshot.rectangle = createRectangle(
            //     startSnapshot.rectangle.x - parentRectangle.x,
            //     startSnapshot.rectangle.y - parentRectangle.y,
            //     startSnapshot.rectangle.width,
            //     startSnapshot.rectangle.height,
            // );

            tweens.set(element, createTween(startSnapshot, finalSnapshot));
        }

        return tweens;

    }

    function extrapolateSnapshot(finalSnapshot: Snapshot, startSnapshot?: Snapshot): Snapshot {

        if (startSnapshot) {
            return startSnapshot;
        }

        return createSnapshot(
            finalSnapshot.rectangle
        );

    }

}
