import { Scheduler } from "./Scheduler";

export type TickFunction = (t: DOMHighResTimeStamp) => void;

export type TickReceiver = (tick: TickFunction) => void;

export function createScheduler(receiver: TickReceiver): Scheduler {

    let time: DOMHighResTimeStamp = 0;

    let scheduledFunction: TickFunction | undefined;

    receiver(function tick(t: DOMHighResTimeStamp): void {

        time = t;

        const toCall = scheduledFunction;

        if (toCall) {
            scheduledFunction = undefined;
            toCall(t);
        }

    });

    return function (callback: FrameRequestCallback) {

        scheduledFunction = callback;

        // if (0 !== rAFID) {
        //     cancelAnimationFrame(rAFID);
        //     rAFID = 0;
        // }

        // rAFID = requestAnimationFrame(function (time: DOMHighResTimeStamp) {
        //     rAFID = 0;
        //     callback(time);
        // });

        return time;

    };

}
