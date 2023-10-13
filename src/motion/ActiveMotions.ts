import { Motion } from "./Motion";

export class ActiveMotions {

    private readonly motions = new WeakMap<Element, Motion[]>();

    private readonly removals = new WeakMap<Element, Set<Motion>>();

    add(motion: Motion): this {
        this.fetch(motion.element).push(motion);
        return this;
    }

    get(element: Element): readonly Motion[] {
        return this.fetch(element);
    }

    has(element: Element): boolean {
        return 0 < this.fetch(element).length;
    }

    remove(motion: Motion): this {

        const element = motion.element;

        let list = this.removals.get(element);

        if ( ! list) {
            this.removals.set(element, list = new Set());
        }

        list.add(motion);

        return this;

    }

    private fetch(element: Element): Motion[] {

        let list = this.motions.get(element);

        if ( ! list) {
            this.motions.set(element, list = []);
        }

        const removals = this.removals.get(element);

        if (removals) {
            list = list.filter(motion => ! removals.has(motion));
            this.motions.set(element, list);
            this.removals.delete(element);
        }

        return list;

    }

}
