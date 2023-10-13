import { Scheduler } from "./Scheduler";

/**
 * ...
 */
export class AnimationFrameScheduler implements Scheduler {

    /**
     * ...
     */
    private rAFID: number = 0;

    /**
     * @inheritdoc
     */
    schedule(callback: FrameRequestCallback): void {

        if (0 < this.rAFID) {
            this.cancel();
        }

        this.rAFID = requestAnimationFrame((time) => {
            this.rAFID = 0;
            callback(time);
        });

    }

    /**
     * @inheritdoc
     */
    cancel(): void {

        if (0 < this.rAFID) {
            cancelAnimationFrame(this.rAFID);
            this.rAFID = 0;
        }

    }

    /**
     * @inheritdoc
     */
    now(): number {
        return performance.now();
    }

}
