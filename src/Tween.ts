import { Snaptshot } from "./Snapshot";
import { EasingFunction } from "./easing/Easing";

export interface Tween {
    /* readonly element: Element; */

    readonly dx: number;
    readonly dy: number;
    readonly dw: number;
    readonly dh: number;

    readonly easing: EasingFunction;
    readonly time: number;
    readonly duration: number;

    readonly start: Snaptshot;
    readonly final: Snaptshot;
}

export function createTween(
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    easing: EasingFunction,
    time: number,
    start: Snaptshot,
    final: Snaptshot,
): Tween {

    return {
        dx,
        dy,
        dw,
        dh,
        easing,
        time,
        duration: 1000.0,
        start,
        final,
    };

}

// export function createTweenFromSnapshots(time: number, start: Snaptshot, final: Snaptshot, easing: EasingFunction): Tween {
//     return {
//         dx: 0.0,
//         dy: 0.0,
//         dw: 0.0,
//         dh: 0.0,
//         easing,
//         time,
//         start,
//         final,
//     };
// }

// export function createTween(start: Rectangle, end: Rectangle, time: number): Tween {
//     return {
//         dx: start.x - end.x,
//         dy: start.y - end.y,
//         dw: start.width - end.width,
//         dh: start.height - end.height,
//         time: time,
//     };
// }

// export function createTween(start: Snapshot, end: Snapshot, time: number): Tween {
//     return {
//         dx: (start.rectangle.x - start.parent.x) - (end.rectangle.x - end.parent.x),
//         dy: (start.rectangle.y - start.parent.y) - (end.rectangle.y - end.parent.y),
//         dw: start.rectangle.width - end.rectangle.width,
//         dh: start.rectangle.height - end.rectangle.height,

//         start,
//         end,
//         time,
//     };
// }
