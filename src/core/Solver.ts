import { Tree } from "../dom/Tree";
import { createLinearEasing } from "../easing/LinearEasing";
import { ActiveMotions } from "../motion/ActiveMotions";
import { Easing } from "../motion/Easing";
import { Tween } from "../motion/Tween";
import { KnownStates } from "../state/KnownStates";
import { MutableSnapshot } from "../state/MutableSnapshot";
import { Snapshot } from "../state/Snapshot";
import { SnapshotPair } from "../state/SnapshotPair";
import { State } from "../state/State";

type ElementSet = Set<Element>;

export class Solver {

    private readonly tree: Tree;

    private readonly time: number;

    private readonly elements: ElementSet;

    private readonly startSnapshot: Snapshot;

    constructor(tree: Tree, time: number) {

        this.tree = tree;
        this.time = time;

        this.elements = new Set();
        this.startSnapshot = this.createSnapshot();

    }

    solve(activeMotions: ActiveMotions, knownStates: KnownStates): void {

        // const easing = new Easing(this.time, 800.0, createBezierEasing(0.25, 0.1, 0.25, 1.0));
        const easing = new Easing(this.time, 100, createLinearEasing());

        const startSnapshot = this.startSnapshot;
        const endSnapshot = this.createSnapshot();

        this.elements.forEach((element) => {

            const finalState = endSnapshot.get(element);
            if (null == finalState) {
                throw new Error('no finalState');
            }

            knownStates.set(element, finalState);

            const parent = finalState.parent;
            if (null == parent) {
                return null;
            }

            // const easing = createEasingFromConfig(time, configManager.get(element));

            const snapshot = new SnapshotPair(
                startSnapshot,
                endSnapshot,
            );

            const tween = new Tween(
                element,
                parent,
                easing,
                snapshot,
            );

            // const finalParent = finalState?.parent;
            // if (finalParent) {
            //     tweenManager.get(element).forEach(t => t.reframe(finalParent));
            // }

            if (tween) {
                activeMotions.add(tween);
                // newTweens.push(tween);
            }

            // if (pulses.has(element)) {
            //     const pulse = createPulse(element, tween, snapshot);
            //     tweenManager.add(element, pulse);
            //     newTweens.push(pulse);
            // }

        });

    }

    createSnapshot(): Snapshot {

        const snapshot = new MutableSnapshot();
        const elements = this.elements;

        this.tree.forEach(function (node) {
            const element = node.element;
            snapshot.set(element, State.fromTreeNode(node));
            elements.add(element);
        });

        return snapshot;

    }

}
