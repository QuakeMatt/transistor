import { Snapshot } from "./Snapshot";

export type TweenCollection = WeakMap<Element, Tween[]>;

export interface Tween {
    /* readonly */ dx: number;
    /* readonly */ dy: number;
    /* readonly */ dw: number;
    /* readonly */ dh: number;

    readonly start: Snapshot;
    readonly end: Snapshot;
    readonly time: number;
}

// export function createTween(start: Rectangle, end: Rectangle, time: number): Tween {
//     return {
//         dx: start.x - end.x,
//         dy: start.y - end.y,
//         dw: start.width - end.width,
//         dh: start.height - end.height,
//         time: time,
//     };
// }

export function createTween(start: Snapshot, end: Snapshot, time: number): Tween {
    return {
        dx: (start.rectangle.x - start.parent.x) - (end.rectangle.x - end.parent.x),
        dy: (start.rectangle.y - start.parent.y) - (end.rectangle.y - end.parent.y),
        dw: start.rectangle.width - end.rectangle.width,
        dh: start.rectangle.height - end.rectangle.height,

        start,
        end,
        time,
    };
}
