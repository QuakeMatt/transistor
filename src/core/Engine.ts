import { Tree } from "../dom/Tree";
import { TreeNode } from "../dom/TreeNode";
import { Accumulator } from "../motion/Accumulator";
import { ActiveMotions } from "../motion/ActiveMotions";
import { IDENTITY_TRANSFORM, Transform } from "../primitive/Transform";
import { KnownStates } from "../state/KnownStates";

/**
 * ...
 */
export class Engine {

    private readonly tree: Tree;

    private readonly activeMotions: ActiveMotions;

    private readonly knownStates: KnownStates;

    constructor(tree: Tree, activeMotions: ActiveMotions, knownStates: KnownStates) {
        this.tree = tree;
        this.activeMotions = activeMotions;
        this.knownStates = knownStates;
    }

    tick(time: number): boolean {

        return 0 < this.transformNodeChildren(this.tree.root, time, IDENTITY_TRANSFORM);

    }

    private transformNodeChildren(node: TreeNode, time: number, carry: Transform): number {

        return node.children.reduce((count, node) => {
            return count + this.transformNode(node, time, carry);
        }, 0);

    }

    private transformNode(node: TreeNode, time: number, carry: Transform): number {

        let count = 0;

        const element = node.element;
        const myTweens = this.activeMotions.get(element);

        const myRectangle = this.knownStates.getRelativeRectangle(element);
        if (null == myRectangle) {
            throw new Error('no last-known rectangle');
        }

        const accumulator = new Accumulator();

        myTweens.forEach(function (tween) {
            if (tween.apply(accumulator, time)) {
                ++count;
            }
        });

        let dw = (accumulator.rectangle.width + myRectangle.width) / myRectangle.width;
        let dh = (accumulator.rectangle.height + myRectangle.height) / myRectangle.height;

        let dx = accumulator.rectangle.x;
        let dy = accumulator.rectangle.y;

        const myTransform = new Transform(dx, dy, dw, dh);

        dw = (accumulator.rectangle.width + myRectangle.width) / myRectangle.width;
        dh = (accumulator.rectangle.height + myRectangle.height) / myRectangle.height;

        dx = accumulator.rectangle.x;
        dy = accumulator.rectangle.y;

        const rw = 1.0 / carry.width;
        const rh = 1.0 / carry.height;

        const rx = myRectangle.x * (rw - 1.0);
        const ry = myRectangle.y * (rh - 1.0);

        // element.setAttribute('style', `transform: translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${dw}, ${dh});`);

        const transformAttr = `translate(${rx}px, ${ry}px) scale(${rw}, ${rh}) translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;

        (element instanceof HTMLElement)
            ? element.style.transform = transformAttr
            : element.setAttribute('style', `transform: ${transformAttr}`);

        return count + this.transformNodeChildren(node, time, myTransform);

    }

}
