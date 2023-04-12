import { MutableSnapshot, createMutableSnapshot } from "./Snapshot";

export {
    MutableSnapshot as KnownStates,
    createMutableSnapshot as createKnownStates,
};

// import { Rectangle } from "../geometry/Rectangle";

// export type KnownStates = WeakMap<Element, Rectangle>;

// export interface KnownStates {
//     get(element: Element): Rectangle | undefined;
// }

// export function createKnownStates(): KnownStates {
//     return new WeakMap();
// }
