import { Rectangle } from "../primitive/Rectangle";
import { State } from "./State";

/**
 * ...
 */
export interface Snapshot {

    /**
     * ...
     *
     * @param element ...
     */
    get(element: Element): State | undefined;

    /**
     * ...
     *
     * @param element ...
     */
    has(element: Element): boolean;

    getRelativeRectangle(element: Element, parent?: Element): Rectangle;

}
