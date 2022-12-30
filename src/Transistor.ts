import { createGraph, Graph, GraphNode } from "./Graph";
import { createPointFromString } from "./Point";
import { Process } from "./Process";
import { createProcessBuilder, ProcessBuilder } from "./ProcessBuilder";
import { createRectangle, Rectangle } from "./Rectangle";
import { Snapshot } from "./Snapshot";

export type FlipFunction = () => void;

export interface Transistor {
    prepare: () => void;
    execute: () => void;
    flip: (mutate: FlipFunction) => void;
    startDebug: () => void;
}

interface ParentState {
    rectangle: Rectangle;
    transform: Rectangle;
}

let DEBUG = false;

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
        startDebug,
    };

    function startDebug(): void {
        DEBUG = true;
    }

    function transformNode(node: GraphNode, time: DOMHighResTimeStamp, parent: ParentState): void {

        const element = node.element;

        const final = snapshots.get(element);
        if (final == null) {
            return;
        }

        DEBUG && console.group(element.className);

        // let tx = TRANSFORM_IDENTITY.x;
        // let ty = TRANSFORM_IDENTITY.y;

        // let dx = (parent.rectangle.x - final.rectangle.x);
        // let dy = (parent.rectangle.y - final.rectangle.y);

        // let kx = dx * parent.transform.width - dx;
        // let ky = dy * parent.transform.height - dy;

        // let tx = (0.0 - parent.transform.x + kx) / parent.transform.width;
        // let ty = (0.0 - parent.transform.y + ky) / parent.transform.height;

        // let tw = 1.0 / parent.transform.width;
        // let th = 1.0 / parent.transform.height;

        // identity translate
        let tx = 0.0;
        let ty = 0.0;

        // identity scale
        let tw = 1.0;
        let th = 1.0;

        // reverse parent translate
        tx = tx - parent.transform.x / parent.transform.width;
        ty = ty - parent.transform.y / parent.transform.height;

        // reverse parent scale
        tw = tw / parent.transform.width;
        th = th / parent.transform.height;

        let dx = final.rectangle.x - parent.rectangle.x;
        let dy = final.rectangle.y - parent.rectangle.y;

        tx = tx + dx / parent.transform.width - dx;
        ty = ty + dy / parent.transform.height - dy;

        DEBUG && console.log({element, final, parent});
        // DEBUG && console.log({dx, dy});

        processes.forEach(function (process) {

            const transform = process.getTransform(element, time);
            // const transform = process.getTransform(element, DEBUG ? 0.0 : time);
            // const transform = process.getTransform(element, 0.0);

            if (null == transform) {
                return;
            }

            tx += transform.x / parent.transform.width;
            ty += transform.y / parent.transform.height;

            // tw *= transform.width;
            // th *= transform.height;

            const sw = transform.width / final.rectangle.width;
            const sh = transform.height / final.rectangle.height;

            tw += sw;
            th += sh;

            DEBUG && console.log({transform, sw, sh});

        });

        // tx += tw * final.origin.x - final.origin.x;
        // ty += th * final.origin.y - final.origin.y;

        // node.element.style.transform = `translate3d(${tx}px, ${ty}px, 1px) scale(${tw}, ${th})`;
        node.element.style.transform = `translate(${tx}px, ${ty}px) scale(${tw}, ${th})`;

        const newParent: ParentState = {
            rectangle: final.rectangle,
            transform: createRectangle(tx, ty, tw, th),
        };

        DEBUG && console.groupEnd();

        transformNodeChildren(node, time, newParent);
    }

    function transformNodeChildren(node: GraphNode, time: DOMHighResTimeStamp, parent: ParentState): void {
        node.children.forEach(node => transformNode(node, time, parent));
    }

    function transformGraph(time: DOMHighResTimeStamp): void {
        transformNodeChildren(graph.getRoot(), time, getRootState());
    }

    function resetTransforms(): void {
        graph.forEach(node => node.element.style.transform = '');
    }

    function getRootState(): ParentState {
        return {
            rectangle: TRANSFORM_IDENTITY,
            transform: TRANSFORM_IDENTITY,
        };
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
            DEBUG && (rAFID = 1); // STOP TICK PROCESSES
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
