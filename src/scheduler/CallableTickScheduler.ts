import { Scheduler } from "./Scheduler";

/**
 * ...
 */
export type CallableTickFunction = (time: number) => void;

/**
 * ...
 */
export type CallableTickReceiver = (tick: CallableTickFunction) => void;

/**
 * ...
 */
export class CallableTickScheduler implements Scheduler {

    /**
     * ...
     */
    private time: number = 0;

    /**
     * ...
     */
    private callback: CallableTickFunction | undefined;

    /**
     * ...
     *
     * @param receiver ...
     */
    constructor(receiver: CallableTickReceiver) {
        receiver(this.tick.bind(this));
    }

    /**
     * ...
     *
     * @param time ...
     */
    tick(time: number): void {

        this.time = time;

        const callback = this.callback;
        if (callback) {
            this.callback = undefined;
            callback(time);
        }

    }

    /**
     * @inheritdoc
     */
    schedule(callback: FrameRequestCallback): void {
        this.callback = callback;
    }

    /**
     * @inheritdoc
     */
    cancel(): void {
        this.callback = undefined;
    }

    /**
     * @inheritdoc
     */
    now(): number {
        return this.time;
    }

}
