import { Rectangle } from "../primitive/Rectangle";
import { Snapshot } from "./Snapshot";
import { State } from "./State";

/**
 * ...
 */
export class MutableSnapshot implements Snapshot {

    /**
     * ...
     */
    private readonly states = new WeakMap<Element, State>();

    /**
     * @inheritdoc
     */
    get(element: Element): State | undefined {
        return this.states.get(element);
    }

    /**
     * @inheritdoc
     */
    has(element: Element): boolean {
        return this.states.has(element);
    }

    /**
     * ...
     * @param element ...
     * @param state ...
     * @returns ...
     */
    set(element: Element, state: State | undefined): Snapshot {
        state ? this.states.set(element, state) : this.states.delete(element);
        return this;
    }

    getRelativeRectangle(element: Element, parent?: Element): Rectangle {

        const elementState = this.states.get(element);
        if (null == elementState || null == elementState.rectangle) {
            throw new Error('no elementState');
        }

        const findParent = parent ?? elementState.parent;
        if (null == findParent) {
            throw new Error('no findParent');
        }

        const parentState = this.states.get(findParent);
        if (null == parentState || null == parentState.rectangle) {
            throw new Error('no parentState');
        }

        return elementState.rectangle.getRelative(parentState.rectangle);

    }

}
