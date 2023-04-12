import { Rectangle, createRectangleFromElement } from "../geometry/Rectangle";
import { GraphNode } from "../runtime/Graph";

export interface State {
    readonly element: Element;
    readonly parent: Element | undefined;
    readonly rectangle: Rectangle | undefined;
    /* readonly absolute: Rectangle | undefined; */
    /* readonly relative: Rectangle | undefined; */
}

export function createState(
    element: Element,
    parent: Element | undefined,
    rectangle: Rectangle | undefined,
    /* elementRectangle: Rectangle | undefined, */
    /* parentRectangle: Rectangle | undefined, */
): State {

    // const absolute = elementRectangle;

    // const relative = (elementRectangle && parentRectangle)
    //     ? createRelativeRectangle(elementRectangle, parentRectangle)
    //     : undefined;

    return {
        element,
        parent,
        rectangle,
        // absolute,
        // relative,
    };

}

export function createStateFromGraphNode(node: GraphNode): State {
    return createState(
        node.element,
        node.parent?.element,
        createRectangleFromElement(node.element),
    );
}
