import { Snapshot } from "./Snapshot";

export type TweenMap = Map<Element, Tween | null>;

export interface Tween {
    startSnapshot: Snapshot,
    finalSnapshot: Snapshot,
}

export function createTween(startSnapshot: Snapshot, finalSnapshot: Snapshot): Tween {
    return {
        startSnapshot,
        finalSnapshot,
    };
}
