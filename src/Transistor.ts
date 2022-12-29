import { createGraph, Graph, GraphNode } from "./Graph";
import { createPointFromString } from "./Point";
import { Process } from "./Process";
import { createProcessBuilder, ProcessBuilder } from "./ProcessBuilder";
import { createRectangle } from "./Rectangle";
import { Snapshot } from "./Snapshot";

export type FlipFunction = () => void;

export interface Transistor {
    prepare: () => void;
    execute: () => void;
    flip: (mutate: FlipFunction) => void;
}

export function createTransistor(root: HTMLElement): Transistor {

    const TRANSFORM_IDENTITY = createRectangle(0.0, 0.0, 1.0, 1.0);

    const graph = createGraph(root);

    const snapshots: WeakMap<HTMLElement, Snapshot> = new WeakMap();

    let processes: Process[] = [];

    let timeNow: DOMHighResTimeStamp = performance.now();

    let pendingProcess: ProcessBuilder | null = null;

    let rAFID = 0;

    scheduleTick();

    return {
        prepare,
        execute,
        flip,
    };

    function transformNode(node: GraphNode, time: DOMHighResTimeStamp): void {

        // const transforms = processes.map(p => p.getTransform(node.element, time));

        // if (0 === transforms.length) {
        //     transforms.push(TRANSFORM_IDENTITY);
        // }

        const element = node.element;

        let tx = TRANSFORM_IDENTITY.x;
        let ty = TRANSFORM_IDENTITY.y;

        let tw = TRANSFORM_IDENTITY.width;
        let th = TRANSFORM_IDENTITY.height;

        processes.forEach(function (process) {

            const transform = process.getTransform(element, time);
            // const transform = process.getTransform(element, 0.0);

            if (null == transform) {
                return;
            }

            tx += transform.x;
            ty += transform.y;

            tw *= transform.width;
            th *= transform.height;

        });

        const final = snapshots.get(element);
        if (final == null) {
            return;
        }

        // const gah = final.origin.x / final.rectangle.width
        // const wah = final.origin.x;
        // const bah = wah * tw;

        // console.log({element, final, tx, tw, wah, bah});

        tx += tw * final.origin.x - final.origin.x;
        ty += th * final.origin.y - final.origin.y;







        // const process = processes[0];

        // const transform = process.getTransform(node.element, time) ?? TRANSFORM_IDENTITY;

        // console.log({node, transform});

        // const tx = transform.x;
        // const ty = transform.y;

        // const tw = transform.width;
        // const th = transform.height;



        node.element.style.transform = `translate3d(${tx}px, ${ty}px, 1px) scale(${tw}, ${th})`;

        transformNodeChildren(node, time);
    }

    function transformNodeChildren(node: GraphNode, time: DOMHighResTimeStamp): void {
        node.children.forEach(node => transformNode(node, time));
    }

    function transformGraph(time: DOMHighResTimeStamp): void {
        transformNodeChildren(graph.rootNode, time);
    }

    function resetTransforms(): void {
        graph.forEach(node => node.element.style.transform = '');
    }

    function tick(time: DOMHighResTimeStamp): void {

        timeNow = time;

        rAFID = 0;

        if (pendingProcess) {
            throw new Error('pending process has not been finalized');
        }

        // processes.forEach(process => process.tick(time));

        if (0 < processes.length) {
            // console.log('process tick', Date.now());
            transformGraph(time);
        }

        const running = processes.filter(function (p) {
            if (p.hasFinished(time)) {
                console.log('Finished running process', Date.now());
                return false;
            }
            return true;
        });

        if (running.length !== processes.length) {
            processes = running;
        }

        // if (0 === processes.length) { // FIXME
            scheduleTick();
        // }


    }

    function scheduleTick() {

        if (0 !== rAFID) {
            return;
        }

        rAFID = requestAnimationFrame(tick);

    }

    function prepare(): void {
        resetTransforms();
        pendingProcess = createProcessBuilder(graph);
    }

    function execute(): void {

        if (null == pendingProcess) {
            throw new Error('needs to have a pending process');
        }

        const process = pendingProcess.build(timeNow);
        processes.push(process);
        pendingProcess = null;

        process.tweens.forEach(function (tween, element) {
            snapshots.set(element, tween.finalSnapshot);
        });

        // processes.forEach(process => process.tick(timeNow));

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
