import { createBezierEasing } from "../easing/BezierEasing";
import { createEasing } from "../easing/Easing";
import { KnownStates } from "../state/KnownStates";
import { Snapshot, createMutableSnapshot } from "../state/Snapshot";
import { createSnapshotPair } from "../state/SnapshotPair";
import { createStateFromGraphNode } from "../state/State";
import { createTweenFromScene } from "../tween/Tween";
import { TweenManager } from "../tween/TweenManager";
import { Graph } from "./Graph";

type ElementSet = Set<Element>;

export interface Solver {
    solve(tweens: TweenManager, states: KnownStates): void;
}

export function createSolver(graph: Graph, time: DOMHighResTimeStamp): Solver {

    const easing = createEasing(time, 1000.0, createBezierEasing(0.25, 0.1, 0.25, 1.0));
    const easing_ = createEasing(time, 1000.0, t => t);

    const allElements: ElementSet = new Set();

    const startSnapshot = createSnapshot(graph, allElements);

    return {
        solve,
    };

    function solve(tweenManager: TweenManager, knownStates: KnownStates): void {

        const endSnapshot = createSnapshot(graph, allElements);

        allElements.forEach(function (element) {

            const finalState = endSnapshot.get(element);
            if (null == finalState) {
                throw new Error('no finalState');
            }

            knownStates.set(element, finalState);

            const parent = finalState.parent;
            if (null == parent) {
                return null;
            }

            const scene = createSnapshotPair(
                startSnapshot,
                endSnapshot,
            );

            const tween = createTweenFromScene(
                element,
                parent,
                easing,
                scene,
            );

            const finalParent = finalState?.parent;
            if (finalParent) {
                tweenManager.get(element).forEach(t => t.reframe(finalParent));
            }

            if (tween) {
                tweenManager.add(element, tween);
            }

        });

    }

    function createSnapshot(graph: Graph, allElements: ElementSet): Snapshot {

        const snapshot = createMutableSnapshot();

        graph.forEach(function (node): void {
            const element = node.element;
            snapshot.set(element, createStateFromGraphNode(node));
            allElements.add(element);
        });

        return snapshot;

    }

}
