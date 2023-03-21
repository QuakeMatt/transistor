import { Snapshot } from "./Snapshot";

export type TweenCollection = WeakMap<Element, Tween[]>;

export interface Tween {
    readonly start: Snapshot;
    readonly end: Snapshot;
    readonly time: number;
}

export function createTween(start: Snapshot, end: Snapshot, time: number): Tween {
    return {
        start,
        end,
        time,
    };
}
