/**
 * ...
 */
export interface Scheduler {

    /**
     * ...
     *
     * @param callback
     */
    schedule(callback: FrameRequestCallback): void;

    /**
     * ...
     */
    cancel(): void;

    /**
     * ...
     *
     * @returns ...
     */
    now(): number;

}
