import { Rectangle, createRelativeRectangle } from "../geometry/Rectangle";

export interface State {
    readonly element: Element;
    readonly parent: Element | undefined;
    readonly absolute: Rectangle | undefined;
    readonly relative: Rectangle | undefined;
}

export function createState(
    element: Element,
    parent: Element | undefined,
    elementRectangle: Rectangle | undefined,
    parentRectangle: Rectangle | undefined,
): State {

    const absolute = elementRectangle;

    const relative = (elementRectangle && parentRectangle)
        ? createRelativeRectangle(elementRectangle, parentRectangle)
        : undefined;

    return {
        element,
        parent,
        absolute,
        relative,
    };

}
