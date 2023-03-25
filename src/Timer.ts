export type TickFunction = (time: number) => void;

export type TimerFactory = (tick: TickFunction) => number;

export function createTimer(tick: TickFunction): number {

    requestAnimationFrame(function zot(time: number): void {
        tick(time);
        requestAnimationFrame(zot);
    })

    return performance.now();

}
