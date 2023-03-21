import { Graph } from "./Graph";
import { Snapshot, SnapshotsMap, createSnapshotFromElement } from "./Snapshot";
import { TweenCollection, createTween } from "./Tween";
import { IDENTITY_RECTANGLE } from "./geometry/Rectangle";

export type CollectVisitor = (element: Element, snapshot: Snapshot) => void;

export interface TweenBuilder {
    build(tweens: TweenCollection, time: number): void;
}

export function createTweenBuilder(graph: Graph): TweenBuilder {

    const startSnapshots: SnapshotsMap = new Map();
    const endSnapshots: SnapshotsMap = new Map();

    collectSnapshots(function (element, snapshot) {
        startSnapshots.set(element, snapshot);
        endSnapshots.set(element, undefined);
    });

    return {
        build,
    };

    function build(tweens: TweenCollection, time: number): void {

        collectSnapshots(function (element, snapshot) {
            endSnapshots.set(element, snapshot);
        });

        endSnapshots.forEach(function (end, element) {

            const start = startSnapshots.get(element);

            if (null == start || null == end) {
                return;
            }

            const list = tweens.get(element) ?? [];

            list.push(createTween(start, end, time));

            tweens.set(element, list);

        });

    }

    function collectSnapshots(visitor: CollectVisitor): void {

        graph.walk(function (node, carry) {

            const element = node.element;
            const snapshot = createSnapshotFromElement(element, carry);

            visitor(element, snapshot);

            return snapshot.rectangle;

        }, IDENTITY_RECTANGLE);

    }

}
