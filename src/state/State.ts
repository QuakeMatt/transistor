import { Rectangle, createRectangleFromElement } from "../geometry/Rectangle";
import { GraphNode } from "../runtime/Graph";

export interface State {
    readonly element: Element;
    readonly parent: Element | undefined;
    readonly rectangle: Rectangle | undefined;
}

export function createState(
    element: Element,
    parent: Element | undefined,
    rectangle: Rectangle | undefined,
): State {
    return {
        element,
        parent,
        rectangle,
    };
}

export function createStateFromGraphNode(node: GraphNode): State {
    return createState(
        node.element,
        node.parent?.element,
        createRectangleFromElement(node.element),
    );
}
