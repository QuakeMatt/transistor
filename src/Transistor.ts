import { createGraph, Graph, GraphNode } from "./Graph";
import { createPointFromString } from "./Point";
import { Process } from "./Process";
import { createProcessBuilder, ProcessBuilder } from "./ProcessBuilder";
import { createRectangle, Rectangle } from "./Rectangle";
import { Snapshot } from "./Snapshot";
import { createTimer } from "./Timer";

export type FlipFunction = () => void;

export interface Transistor {
    prepare: () => void;
    execute: () => void;
    flip: (mutate: FlipFunction) => void;
}

interface ParentState {
    rectangle: Rectangle;
    transform: Rectangle;
}

interface TransistorOptions {
    root?: HTMLElement,
    timer?: Function,
}

export function createTransistor(options: TransistorOptions = {}): Transistor {

    console.log('creating transistor');

    const TRANSFORM_IDENTITY = createRectangle(0.0, 0.0, 1.0, 1.0);

    const graph = createGraph(options.root ?? document.documentElement);

    const snapshots: WeakMap<HTMLElement, Snapshot> = new WeakMap();

    let processes: Process[] = [];

    let timeNow: number = (options.timer ?? createTimer)(tick);

    let pendingProcess: ProcessBuilder | null = null;

    const DEBUG = !! options.timer; // enable debug with custom timer

    return {
        prepare,
        execute,
        flip,
    };

    function transformNode(node: GraphNode, time: number, parent: ParentState): void {

        const element = node.element;

        // const final = snapshots.get(element);
        // if (final == null) {
        //     return;
        // }

        DEBUG && console.group(element.className);

        /*
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

        // opacity
        let opacity = final.opacity;

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

            opacity += process.getOpacity(element, time);

            DEBUG && console.log({transform, sw, sh});

        });

        // tx += tw * final.origin.x - final.origin.x;
        // ty += th * final.origin.y - final.origin.y;
        */

        let tx = 0.0;
        let ty = 0.0;

        let dw = 0.0;
        let dh = 0.0;

        let fw = 1.0;
        let fh = 1.0;

        // let tw = 1.0;
        // let th = 1.0;

        processes.forEach(function (process) {

            const transform = process.getTransform(element, time, parent.transform);
            const tween = process.getTween(element);

            DEBUG && console.log({element, transform, tween, parent});

            if (null == transform || null == tween) {
                return;
            }

            tx += transform.x;
            ty += transform.y;

            dw += transform.width;
            dh += transform.height;

            fw = tween.finalSnapshot.rectangle.width;
            fh = tween.finalSnapshot.rectangle.height;

        });

        // // console.log({tx, ty});
        // tx = tx + parent.transform.width * 0.0;
        // ty = ty + parent.transform.height * 0.0;

        let tw = (fw + dw) / fw / parent.transform.width;
        let th = (fh + dh) / fh / parent.transform.height;

        // node.element.style.transform = `translate3d(${tx}px, ${ty}px, 1px) scale(${tw}, ${th})`;
        node.element.style.transform = `translate(${tx}px, ${ty}px) scale(${tw}, ${th})`;

        const newParent: ParentState = {
            rectangle: TRANSFORM_IDENTITY,
            transform: createRectangle(tx, ty, tw, th),
        };

        DEBUG && console.groupEnd();

        transformNodeChildren(node, time, newParent);
    }

    function transformNodeChildren(node: GraphNode, time: number, parent: ParentState): void {
        node.children.forEach(node => transformNode(node, time, parent));
    }

    function transformGraph(time: number): void {
        transformNodeChildren(graph.getRoot(), time, getRootState());
    }

    function resetTransforms(): void {
        graph.forEach(function (node) {
            node.element.style.transform = '';
        });
    }

    function getRootState(): ParentState {
        return {
            rectangle: TRANSFORM_IDENTITY,
            transform: TRANSFORM_IDENTITY,
        };
    }

    function tick(time: number): void {

        DEBUG && console.log('tick', {was: timeNow, now: time});

        timeNow = time;

        if (pendingProcess) {
            throw new Error('pending process has not been finalized');
        }

        // processes.forEach(process => process.tick(time));

        if (0 < processes.length) {
            transformGraph(time);
            // DEBUG && (rAFID = 1); // STOP TICK PROCESSES
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

        // return (0 < processes.length);

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

        // process.tweens.forEach(function (tween, element) {
        //     snapshots.set(element, tween.finalSnapshot);
        // });

        // processes.forEach(process => process.tick(timeNow));

    }

    function flip(mutate: FlipFunction): void {
        prepare();
        mutate();
        execute();
    }

}
