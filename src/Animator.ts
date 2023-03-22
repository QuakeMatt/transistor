import { Graph, GraphNode } from "./Graph";
import { TweenCollection } from "./Tween";
import { createBezierEasing } from "./easing/BezierEasing";
import { IDENTITY_RECTANGLE, Rectangle, createRectangle } from "./geometry/Rectangle";

export interface Animator {
    tick(time: number): void;
    reset(): void;
}

export function createAnimator(graph: Graph, tweens: TweenCollection): Animator {

    const duration = 1000.0;

    const easing = createBezierEasing(0.25, 0.1, 0.25, 1.0);
    // const easing = createBezierEasing(0.0, 0.0, 1.0, 1.0);

    return {
        tick,
        reset,
    };

    function transformNode(time: number, node: GraphNode, carry: Rectangle): Rectangle {

        const element = node.element;

        let dx = 0.0;
        let dy = 0.0;

        let dw = 0.0;
        let dh = 0.0;

        let tw = 1.0;
        let th = 1.0;

        let rx = 0.0;
        let ry = 0.0;

        (tweens.get(element) ?? []).forEach(function (tween) {

            let elapsed = Math.max(0.0, Math.min((time - tween.time) / duration, 1.0));
            let progress = 1.0 - easing(elapsed);

            dx += ((tween.start.rectangle.x - tween.start.parent.x) - (tween.end.rectangle.x - tween.end.parent.x)) * progress;
            dy += ((tween.start.rectangle.y - tween.start.parent.y) - (tween.end.rectangle.y - tween.end.parent.y)) * progress;

            dw += (tween.start.rectangle.width - tween.end.rectangle.width) * progress;
            dh += (tween.start.rectangle.height - tween.end.rectangle.height) * progress;

            tw = tween.end.rectangle.width;
            th = tween.end.rectangle.height;

            rx = tween.end.rectangle.x - tween.end.parent.x;
            ry = tween.end.rectangle.y - tween.end.parent.y;

        });

        tw = (tw + dw) / tw;
        th = (th + dh) / th;

        const rw = 1.0 / carry.width;
        const rh = 1.0 / carry.height;

        rx = rx * rw - rx;
        ry = ry * rh - ry;

        element.setAttribute('style', `transform: translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${tw}, ${th});`);

        return createRectangle(dx, dy, tw, th);

    }

    function resetNode(node: GraphNode): void {
        node.element.setAttribute('style', '');
    }

    function tick(time: number): void {

        // console.log('tick', {graph, tweens, time});

        graph.walk(transformNode.bind(null, time), IDENTITY_RECTANGLE);

    }

    function reset(): void {

        graph.walk(resetNode);

    }

}
