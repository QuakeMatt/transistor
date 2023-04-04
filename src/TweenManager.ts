import { Tween } from "./Tween";

export interface TweenManager {
    add(element: Element, tween: Tween): void;
    get(element: Element): readonly Tween[];
    has(element: Element): boolean;
}

export function createTweenManager(): TweenManager {

    const map: WeakMap<Element, Tween[]> = new WeakMap();

    return {
        add,
        get,
        has,
    };

    function add(element: Element, tween: Tween): void {

        let list = map.get(element);

        if (null == list) {
            map.set(element, list = []);
        }

        list.push(tween);

    }

    function get(element: Element): readonly Tween[] {

        return map.get(element) ?? [];

    }

    function has(element: Element): boolean {

        const list = map.get(element);
        return null != list && 0 < list.length;

    }

}
