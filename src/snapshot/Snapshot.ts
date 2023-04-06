import { State } from "./State";

export interface Snapshot {
    get(element: Element): State | undefined;
    has(element: Element): boolean;
}

export interface SnapshotBuilder extends Snapshot {
    set(element: Element, state: State): void;
}

export function createSnapshotBuilder(): SnapshotBuilder {
    return new WeakMap<Element, State>();
}
