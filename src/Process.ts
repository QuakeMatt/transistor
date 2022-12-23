import { Graph, GraphNode } from "./Graph";
import { TweenMap } from "./Tween";

export interface Process {
    tick: (time: DOMHighResTimeStamp) => void;
}

export function createProcess(
    startTime: DOMHighResTimeStamp,
    graph: Graph,
    tweens: TweenMap,
): Process {

    console.log({graph, tweens});

    // let startTime: DOMHighResTimeStamp | null = null;

    // transformGraph(0);

    return {
        tick,
    };

    function ease(elapsed: number, duration: number) {
        const x = Math.max(0.0, Math.min(elapsed / duration, 1.0));
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function transformNode(node: GraphNode, elapsed: number): void {

        const tween = tweens.get(node.element);

        if (null == tween) {
            return;
        }

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

        const ox = final.origin.x / final.rectangle.width;
        const wx = (final.rectangle.width - start.rectangle.width) * ox;
        tx = tx - wx * invgress;

        const oy = final.origin.y / final.rectangle.height;
        const wy = (final.rectangle.height - start.rectangle.height) * oy;
        ty = ty - wy * invgress;

        node.element.style.transform = `translate3d(${tx}px, ${ty}px, 1px) scale(${tw}, ${th})`;

        transformNodeChildren(node, elapsed);
        // console.log('transformNode', {node, tween});
    }

    function transformNodeChildren(node: GraphNode, elapsed: number): void {
        node.children.forEach(node => transformNode(node, elapsed));
    }

    function transformGraph(elapsed: number): void {
        transformNodeChildren(graph.rootNode, elapsed);
    }

    function tick(time: DOMHighResTimeStamp): void {
        // startTime = startTime ?? time;
        transformGraph(time - startTime);
        // transformGraph(0.0);
    }

}
