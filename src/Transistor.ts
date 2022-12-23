import { createGraph, Graph, GraphNode } from "./Graph";
import { Process } from "./Process";
import { createProcessBuilder, ProcessBuilder } from "./ProcessBuilder";

export type FlipFunction = () => void;

export interface Transistor {
    prepare: () => void;
    execute: () => void;
    flip: (mutate: FlipFunction) => void;
}

export function createTransistor(root: HTMLElement): Transistor {

    const graph = createGraph(root);

    const processes: Process[] = [];

    let timeNow: DOMHighResTimeStamp = performance.now();

    let pendingProcess: ProcessBuilder | null = null;

    let rAFID = 0;

    scheduleTick();

    return {
        prepare,
        execute,
        flip,
    };

    function tick(time: DOMHighResTimeStamp): void {

        timeNow = time;

        rAFID = 0;

        if (pendingProcess) {
            throw new Error('pending process has not been finalized');
        }

        processes.forEach(process => process.tick(time));

        scheduleTick();

    }

    function scheduleTick() {

        if (0 !== rAFID) {
            return;
        }

        rAFID = requestAnimationFrame(tick);

    }

    function prepare(): void {
        pendingProcess = createProcessBuilder(graph);

    }

    function execute(): void {

        if (null == pendingProcess) {
            throw new Error('needs to have a pending process');
        }

        processes.length = 0; // FIXME
        processes.push(pendingProcess.build(timeNow));
        pendingProcess = null;

        // processes.forEach(process => process.tick(timeNow));

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
