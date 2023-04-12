import { Tween } from "./Tween";

export interface TweenManager {
    add(element: Element, tween: Tween): void;
    get(element: Element): readonly Tween[];
    has(element: Element): boolean;
    remove(tween: Tween): void;
}

export function createTweenManager(): TweenManager {

    const tweenMap: WeakMap<Element, Tween[]> = new WeakMap();

    const toRemove: WeakMap<Element, WeakSet<Tween>> = new WeakMap();

    return {
        add,
        get,
        has,
        remove,
    };

    function add(element: Element, tween: Tween): void {

        let list = tweenMap.get(element);

        if (null == list) {
            tweenMap.set(element, list = []);
        }

        list.push(tween);

    }

    function get(element: Element): readonly Tween[] {

        let list = tweenMap.get(element) ?? [];

        const removals = toRemove.get(element);

        if (removals) {
            list = list.filter(t => ! removals.has(t));
            tweenMap.set(element, list);
            toRemove.delete(element);
        }

        return list;

    }

    function has(element: Element): boolean {

        const list = tweenMap.get(element);
        return null != list && 0 < list.length;

    }

    function remove(tween: Tween): void {

        const element = tween.element;

        let list = toRemove.get(element);

        if (null == list) {
            toRemove.set(element, list = new WeakSet());
        }

        list.add(tween);

    }

}
