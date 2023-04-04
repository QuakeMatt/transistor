import { Graph } from "./Graph";
import { Snaptshot, createSnaptshot, createSnaptshotNode } from "./Snapshot";
import { createTween } from "./Tween";
import { TweenManager } from "./TweenManager";
import { createBezierEasing } from "./easing/BezierEasing";

// export type CollectVisitor = (element: Element, snapshot: Snapshot) => void;

export interface TweenBuilder {
    build(tweens: TweenManager, time: number): void;
}

export function createTweenBuilder(graph: Graph): TweenBuilder {

    const easing = createBezierEasing(0.25, 0.1, 0.25, 1.0);

    const elements: Set<Element> = new Set();

    const start = createSnaptshot();

    graph.walk(function (node) {
        const element = node.element;
        start.set(element, createSnaptshotNode(element, node.parent?.element));
        elements.add(element);
    });

    // // const startSnapshots: SnapshotsMap = new Map();
    // // const endSnapshots: SnapshotsMap = new Map();

    // const startHierarchy: Map<Element, Element | undefined> = new Map();
    // const endHierarchy: Map<Element, Element | undefined> = new Map();

    // const startRectangles: Map<Element, Rectangle | undefined> = new Map();
    // const endRectangles: Map<Element, Rectangle | undefined> = new Map();

    // collectSnapshots(function (element, snapshot) {
    //     // startSnapshots.set(element, snapshot);
    //     // endSnapshots.set(element, undefined);

    //     startHierarchy.set(element, snapshot.parentElement);
    //     startRectangles.set(element, snapshot.rectangle);

    //     endHierarchy.set(element, undefined);
    //     endRectangles.set(element, undefined);
    // });

    return {
        build,
    };

    function build(tweens: TweenManager, time: number): Snaptshot {

        const final = createSnaptshot();

        graph.walk(function (node) {
            const element = node.element;
            start.set(element, createSnaptshotNode(element, node.parent?.element));
            elements.add(element);
        });

        elements.forEach(function (element) {

            const elementStart = start.get(element);
            if (null == elementStart) {
                return;
            }

            const elementFinal = final.get(element);
            if (null == elementFinal) {
                return;
            }

            const parent = elementFinal.parent;
            if (null == parent) {
                return;
            }

            const parentStart = start.get(parent);
            if (null == parentStart) {
                return;
            }

            const parentFinal = start.get(parent);
            if (null == parentFinal) {
                return;
            }

            const tween = createTween(
                (elementStart.rectangle.x - parentStart.rectangle.x) - (elementFinal.rectangle.x - parentFinal.rectangle.x),
                (elementStart.rectangle.y - parentStart.rectangle.y) - (elementFinal.rectangle.y - parentFinal.rectangle.y),
                elementStart.rectangle.width - elementFinal.rectangle.width,
                elementStart.rectangle.height - elementFinal.rectangle.height,
                easing,
                time,
                start,
                final,
            );

            tweens.add(element, tween);

        });

        return final;



        // collectSnapshots(function (element, snapshot) {
        //     // endSnapshots.set(element, snapshot);
        //     endHierarchy.set(element, snapshot.parentElement);
        //     endRectangles.set(element, snapshot.rectangle);
        // });

        // endRectangles.forEach(function (endRectangle, element) {

        //     if (null == endRectangle) {
        //         throw new Error('no end rectangle!');
        //     }

        //     const parent = endHierarchy.get(element);
        //     if (null == parent) {
        //         throw new Error('no parent element!');
        //     }

        //     const startRectangle = startRectangles.get(element);
        //     if (null == startRectangle) {
        //         throw new Error('no start rectangle!');
        //     }

        //     const startParentRectangle = startRectangles.get(parent);
        //     if (null == startParentRectangle) {
        //         throw new Error('no parent start rectangle!');
        //     }

        //     const endParentRectangle = endRectangles.get(parent);
        //     if (null == endParentRectangle) {
        //         throw new Error('no parent end rectangle!');
        //     }

        //     const startSnapshot = createSnapshot(startRectangle, startParentRectangle, parent);
        //     const endSnapshot = createSnapshot(endRectangle, endParentRectangle, parent);

        //     const list = tweens.get(element) ?? [];

        //     list.push(createTween(startSnapshot, endSnapshot, time));

        //     if ((element.classList.contains('baz') || element.classList.contains('qux')) && 2 === list.length) {
        //         const name = element.className.replace('is-active', '').trim();
        //         console.group(`tweens for ${name}`);
        //         list.forEach((t) => console.log(t));
        //         console.groupEnd();
        //         list[0] = reframeTween(list[0], list[1], name);
        //     }

        //     tweens.set(element, list);

        // });

    }

    // function reframeTween(original: Tween, target: Tween, name: string): Tween {

    //     console.group(`reframing tween for ${name}`);

    //     console.log('original', original);
    //     console.log('target', target);

    //     const magicRectangle = (name === 'qux')
    //         ? createRectangle(510, 70, 160, 240)
    //         : target.start.parent;

    //     const reframed = createTween(
    //         createSnapshot(
    //             original.start.rectangle,
    //             magicRectangle,
    //             target.start.parentElement,
    //         ),
    //         createSnapshot(
    //             original.end.rectangle,
    //             target.end.parent,
    //             target.end.parentElement,
    //         ),
    //         original.time,
    //     );

    //     // const expected = createTween(
    //     //     createSnapshot(
    //     //         original.start.rectangle,
    //     //         target.start.parent,
    //     //         target.start.parentElement,
    //     //     ),
    //     //     createSnapshot(
    //     //         original.end.rectangle,
    //     //         target.end.parent,
    //     //         target.end.parentElement,
    //     //     ),
    //     //     original.time,
    //     // );

    //     // console.log('expected', expected);
    //     console.log('reframed', reframed);

    //     console.groupEnd();

    //     // return original;
    //     return reframed;

    // }

    // function collectSnapshots(visitor: CollectVisitor): void {

    //     graph.walk(function (node, carry) {

    //         const element = node.element;
    //         const parent = node.parent?.element;
    //         const snapshot = createSnapshotFromElement(element, parent ?? element);

    //         visitor(element, snapshot);

    //         return snapshot.rectangle;

    //     }, IDENTITY_RECTANGLE);

    // }

}
