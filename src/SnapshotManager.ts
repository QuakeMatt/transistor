import { Snaptshot, createSnaptshot } from "./Snapshot";

export interface SnaptshotManager {
    // add(element: Element, tween: Tween): void;
    get(element: Element): DOMRect | undefined;
    set(snapshot: Snaptshot): void;
    // has(element: Element): boolean;
}

export function createSnaptshotManager(): SnaptshotManager {

    let map = createSnaptshot();

    return {
        get,
        set,
    };

    function get(element: Element): DOMRect | undefined {
        return map.get(element)?.rectangle;
    }

    function set(snapshot: Snaptshot): void {
        map = snapshot;
    }

}
