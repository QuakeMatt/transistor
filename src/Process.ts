import { createBezierEasing } from "./BezierEasing";
import { Graph, GraphNode } from "./Graph";
import { createRectangle, Rectangle } from "./Rectangle";
import { Tween, TweenMap } from "./Tween";

export interface Process {
    // tick: (time: DOMHighResTimeStamp) => void;
    hasFinished: (time: DOMHighResTimeStamp) => boolean;
    getOpacity: (element: HTMLElement, time: DOMHighResTimeStamp) => number;
    getTransform: (element: HTMLElement, time: DOMHighResTimeStamp) => Rectangle | null;
    // getTween: (element: HTMLElement) => Tween | null;
    // getTweens: () => TweenMap;
    tweens: TweenMap;
    startTime: DOMHighResTimeStamp;
}

export function createProcess(
    startTime: DOMHighResTimeStamp,
    graph: Graph,
    tweens: TweenMap,
): Process {

    console.log({graph, tweens});

    // let startTime: DOMHighResTimeStamp | null = null;

    // transformGraph(0);

    const endTime = startTime + 1000.0;

    const bezierEasing = createBezierEasing(0.25, 0.1, 0.25, 1.0);
    // const bezierEasing = function (x: number): number {
    //     return x;
    // };

    return {
        hasFinished,
        getOpacity,
        getTransform,
        // getTween,
        tweens,
        startTime,
    };

    function hasFinished(time: DOMHighResTimeStamp): boolean {
        return time > endTime;
    }

    function ease(elapsed: number, duration: number) {
        const x = Math.max(0.0, Math.min(elapsed / duration, 1.0));
        return bezierEasing(x);
        // return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function getTweens(): TweenMap {
        return tweens;
    }

    function getTween(element: HTMLElement): Tween | null {
        return tweens.get(element) ?? null;
    }

    function getTransform(element: HTMLElement, time: DOMHighResTimeStamp): Rectangle | null {

        const tween = tweens.get(element);

        if (null == tween) {
            return null;
        }

        const elapsed = time - startTime;

        const start = tween.startSnapshot;
        const final = tween.finalSnapshot;

        // const rx = localRectangle.x - parentRectangle.x;
        // const ry = localRectangle.y - parentRectangle.y;

        // const tx = localTransform.x - parentTransform.x + rx / parentTransform.w - rx + finalTransform.x;
        // const ty = localTransform.y - parentTransform.y + ry / parentTransform.h - ry + finalTransform.y;
        // const tw = localTransform.w / parentTransform.w * finalTransform.w;
        // const th = localTransform.h / parentTransform.h * finalTransform.h;

        const progress = ease(elapsed, 1000);
        const invgress = 1.0 - ease(elapsed, 1000);

        let tx = (start.rectangle.x - final.rectangle.x) * invgress;
        let ty = (start.rectangle.y - final.rectangle.y) * invgress;

        const tw = (start.rectangle.width / final.rectangle.width) * invgress + progress;
        const th = (start.rectangle.height / final.rectangle.height) * invgress + progress;

        const sw = (start.rectangle.width - final.rectangle.width) * invgress;
        const sh = (start.rectangle.height - final.rectangle.height) * invgress;

        // const ox = final.origin.x / final.rectangle.width;
        // const wx = (final.rectangle.width - start.rectangle.width) * ox;
        // tx = tx - wx * invgress;

        // const oy = final.origin.y / final.rectangle.height;
        // const wy = (final.rectangle.height - start.rectangle.height) * oy;
        // ty = ty - wy * invgress;

        return createRectangle(tx, ty, sw, sh);

        // node.element.style.transform = `translate3d(${tx}px, ${ty}px, 1px) scale(${tw}, ${th})`;

        // transformNodeChildren(node, elapsed);
        // console.log('transformNode', {node, tween});
    }

    function getOpacity(element: HTMLElement, time: DOMHighResTimeStamp): number {

        const tween = tweens.get(element);

        if (null == tween) {
            return 0.0;
        }

        const elapsed = time - startTime;

        const start = tween.startSnapshot;
        const final = tween.finalSnapshot;

        return (start.opacity - final.opacity) * (1.0 - ease(elapsed, 1000));

    }

    // function transformNodeChildren(node: GraphNode, elapsed: number): void {
    //     node.children.forEach(node => transformNode(node, elapsed));
    // }

    // function transformGraph(elapsed: number): void {
    //     transformNodeChildren(graph.rootNode, elapsed);
    // }

    // function tick(time: DOMHighResTimeStamp): void {
    //     // startTime = startTime ?? time;
    //     transformGraph(time - startTime);
    //     // transformGraph(0.0);
    // }

}
