import { Graph } from "./Graph";
import { createProcess, Process } from "./Process";
import { createSnapshot } from "./Snapshot";
import { SnapshotsMap } from "./SnapshotsMap";
import { createTween, TweenMap } from "./Tween";

export interface ProcessBuilder {
    build: (time: DOMHighResTimeStamp) => Process;
}

export function createProcessBuilder(graph: Graph): ProcessBuilder {

    const startSnapshots: SnapshotsMap = new Map();
    const finalSnapshots: SnapshotsMap = new Map();

    graph.forEach(function (node) {
        startSnapshots.set(node.element, createSnapshot(node.element));
        finalSnapshots.set(node.element, undefined);
    });

    return {
        build,
    };

    function build(time: DOMHighResTimeStamp): Process {

        graph.forEach(function (node) {
            finalSnapshots.set(node.element, createSnapshot(node.element));
        });

        return createProcess(time, graph, createTweens());

    }

    function createTweens(): TweenMap {

        const tweens: TweenMap = new Map();

        for (const element of finalSnapshots.keys()) {
            const startSnapshot = startSnapshots.get(element);
            const finalSnapshot = finalSnapshots.get(element);
            startSnapshot && finalSnapshot && tweens.set(element, createTween(startSnapshot, finalSnapshot));
        }

        return tweens;

    }

}
