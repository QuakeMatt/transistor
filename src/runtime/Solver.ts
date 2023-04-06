import { createBezierEasing } from "../easing/BezierEasing";
import { createEasing } from "../easing/Easing";
import { Rectangle, createRectangleFromElement } from "../geometry/Rectangle";
import { KnownStates } from "../snapshot/KnownStates";
import { Snapshot, createSnapshotBuilder } from "../snapshot/Snapshot";
import { createState } from "../snapshot/State";
import { createTweenFromSnapshots } from "../tween/Tween";
import { TweenManager } from "../tween/TweenManager";
import { Graph, GraphNode } from "./Graph";

export interface Solver {
    solve(tweens: TweenManager, states: KnownStates): void;
}

export function createSolver(graph: Graph, time: DOMHighResTimeStamp): Solver {

    const easing = createEasing(time, 1000.0, createBezierEasing(0.25, 0.1, 0.25, 1.0));

    const elements = new Set<Element>();

    const startSnapshot = collectSnapshots();

    return {
        solve,
    };

    function solve(tweens: TweenManager, states: KnownStates): void {

        const finalSnapshot = collectSnapshots();

        elements.forEach(function (element) {

            const startState = startSnapshot.get(element);
            const finalState = finalSnapshot.get(element);

            const tween = createTweenFromSnapshots(
                element,
                easing,
                startSnapshot,
                finalSnapshot,
            );

            if (tween) {
                tweens.add(element, tween);
            }

            finalState
                ? states.set(element, finalState)
                : states.delete(element);

        });

    }

    function collectSnapshots(): Snapshot {

        const snapshot = createSnapshotBuilder();
        visitGraphNode(graph.getRoot());
        return snapshot;

        function visitGraphNode(node: GraphNode, parent?: Element, parentRectangle?: Rectangle): void {

            const element = node.element;
            const elementRectangle = createRectangleFromElement(element);

            snapshot.set(element, createState(element, parent, elementRectangle, parentRectangle));

            elements.add(element);

            node.children.forEach(function (node) {
                visitGraphNode(node, element, elementRectangle);
            });

        }

    }

}
