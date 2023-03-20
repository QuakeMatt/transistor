export function createTimer(tick: Function) {

    requestAnimationFrame(doop);

    return performance.now();

    function doop(t: number) {
        tick(t);
        requestAnimationFrame(doop);
    }

}
