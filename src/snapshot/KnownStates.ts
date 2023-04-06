import { State } from "./State";

export type KnownStates = WeakMap<Element, State>;

export function createKnownStates(): KnownStates {
    return new WeakMap();
}
