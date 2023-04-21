import { ConfigManager } from "../config/ConfigManager";
import { KnownStates } from "../state/KnownStates";
import { Snapshot, createMutableSnapshot } from "../state/Snapshot";
import { createSnapshotPair } from "../state/SnapshotPair";
import { createStateFromGraphNode } from "../state/State";
import { createEasingFromConfig } from "../tween/Easing";
import { createPulse } from "../tween/Pulse";
import { Tween, createTweenFromSnapshot } from "../tween/Tween";
import { TweenManager } from "../tween/TweenManager";
import { Graph } from "./Graph";

type ElementSet = Set<Element>;

export interface Solver {
    readonly config: ConfigManager;
    readonly time: DOMHighResTimeStamp;
    solve(tweens: TweenManager, states: KnownStates): Tween[];
    pulse(elements: Iterable<Element>): void;
}

export function createSolver(graph: Graph, configManager: ConfigManager, time: DOMHighResTimeStamp): Solver {

    // const easing_ = createEasing(time, 1000.0, createBezierEasing(0.25, 0.1, 0.25, 1.0));
    // const easing = createEasing(time, 1000.0, easeInOutQuint);

    const pulses = new Set<Element>();

    const allElements: ElementSet = new Set();

    const startSnapshot = createSnapshot(graph, allElements);

    return {
        config: configManager,
        time,
        solve,
        pulse,
    };

    function solve(tweenManager: TweenManager, knownStates: KnownStates): Tween[] {

        const newTweens: Tween[] = [];

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

            const easing = createEasingFromConfig(time, configManager.get(element));

            const snapshot = createSnapshotPair(
                startSnapshot,
                endSnapshot,
            );

            const tween = createTweenFromSnapshot(
                element,
                parent,
                easing,
                snapshot,
            );

            const finalParent = finalState?.parent;
            if (finalParent) {
                tweenManager.get(element).forEach(t => t.reframe(finalParent));
            }

            if (tween) {
                tweenManager.add(element, tween);
                newTweens.push(tween);
            }

            if (pulses.has(element)) {
                const pulse = createPulse(element, tween, snapshot);
                tweenManager.add(element, pulse);
                newTweens.push(pulse);
            }

        });

        return newTweens;

    }

    function pulse(elements: Iterable<Element>): void {
        for (const element of elements) {
            pulses.add(element);
        }
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
