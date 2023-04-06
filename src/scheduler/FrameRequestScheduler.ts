import { Scheduler } from "./Scheduler";

export function createScheduler(): Scheduler {

    let rAFID = 0;

    return function (callback: FrameRequestCallback) {

        if (0 !== rAFID) {
            cancelAnimationFrame(rAFID);
            rAFID = 0;
        }

        rAFID = requestAnimationFrame(function (time: DOMHighResTimeStamp) {
            rAFID = 0;
            callback(time);
        });

        return performance.now();

    };

}
