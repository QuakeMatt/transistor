import { Graph } from "./Graph";
import { createProcess, Process } from "./Process";
import { createRectangle } from "./Rectangle";
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
            console.log({node});
            finalSnapshots.set(node.element, createSnapshotFromElement(node.element));
        });

        return createProcess(time, graph, createTweens());

    }

    function createTweens(): TweenMap {

        const tweens: TweenMap = new Map();

        for (const element of finalSnapshots.keys()) {

            const finalSnapshot = finalSnapshots.get(element);
            if (null == finalSnapshot) {
                continue;
            }

            const startSnapshot = extrapolateSnapshot(finalSnapshot, startSnapshots.get(element));
            tweens.set(element, createTween(startSnapshot, finalSnapshot));
        }

        return tweens;

    }

    function extrapolateSnapshot(finalSnapshot: Snapshot, startSnapshot: Snapshot | undefined): Snapshot {

        if (startSnapshot) {
            return startSnapshot;
        }

        return createSnapshot(
            // createRectangle(
            //     finalSnapshot.rectangle.x,
            //     finalSnapshot.rectangle.y,
            //     finalSnapshot.rectangle.width * 0.5,
            //     finalSnapshot.rectangle.height * 0.5,
            // ),
            finalSnapshot.rectangle,
            0.0,
            finalSnapshot.origin
        );

    }

}
