import { TreeNode } from "../dom/TreeNode";
import { Rectangle } from "../primitive/Rectangle";

export class State {

    public readonly element: Element;

    public readonly parent: Element | undefined;

    public readonly rectangle: Rectangle | undefined;

    constructor(element: Element, parent?: Element, rectangle?: Rectangle) {
        this.element = element;
        this.parent = parent;
        this.rectangle = rectangle;
    }

    static fromTreeNode(node: TreeNode): State {
        return new State(
            node.element,
            node.parent?.element,
            Rectangle.fromElement(node.element),
        );
    }

}
