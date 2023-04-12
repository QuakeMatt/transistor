import { Rectangle, createRelativeRectangle } from "../geometry/Rectangle";
import { State } from "./State";

export interface Snapshot {
    get(element: Element): State | undefined;
    has(element: Element): boolean;
    getRelativeRectangle(element: Element): Rectangle;
    getRelativeRectangle(element: Element, parent: Element): Rectangle;
}

export interface MutableSnapshot extends Snapshot {
    set(element: Element, state: State | undefined): MutableSnapshot;
}

export function createMutableSnapshot(): MutableSnapshot {

    const states = new WeakMap<Element, State>();

    const self: MutableSnapshot = {
        get: states.get.bind(states),
        has: states.has.bind(states),
        set,
        getRelativeRectangle,
    };

    return self;

    function set(element: Element, state: State | undefined): MutableSnapshot {
        state ? states.set(element, state) : states.delete(element);
        return self;
    }

    function getRelativeRectangle(element: Element, parent?: Element): Rectangle {

        const elementState = states.get(element);
        if (null == elementState || null == elementState.rectangle) {
            throw new Error('no elementState');
        }

        const findParent = parent ?? elementState.parent;
        if (null == findParent) {
            throw new Error('no findParent');
        }

        const parentState = states.get(findParent);
        if (null == parentState || null == parentState.rectangle) {
            throw new Error('no parentState');
        }

        return createRelativeRectangle(elementState.rectangle, parentState.rectangle);

    }

}
