import { Graph, GraphNode } from "./Graph";
import { TweenCollection } from "./Tween";
import { IDENTITY_RECTANGLE, Rectangle } from "./geometry/Rectangle";

export interface Animator {
    tick(time: number): void;
}

export function createAnimator(graph: Graph, tweens: TweenCollection): Animator {

    const duration = 1000.0;

    return {
        tick,
    };

    function visitNode(time: number, node: GraphNode, carry: Rectangle): Rectangle {

        const element = node.element;

        let tx = 0.0;
        let ty = 0.0;

        (tweens.get(element) ?? []).forEach(function (tween) {

            let elapsed = time - tween.time;
            let progress = 1.0 - Math.max(0.0, Math.min(elapsed / duration, 1.0));

            tx += (tween.start.rectangle.x - tween.end.rectangle.x) * progress;
            ty += (tween.start.rectangle.y - tween.end.rectangle.y) * progress;

        });

        element.setAttribute('style', `transform: translate(${tx}px, ${ty}px)`);

        return carry;

    }

    function tick(time: number): void {

        // console.log('tick', {graph, tweens, time});

        graph.walk(visitNode.bind(null, time), IDENTITY_RECTANGLE);

    }

}
