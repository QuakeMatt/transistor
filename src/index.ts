// import { FlipFunction, Transistor, createTransistor } from "./runtime/Transistor";

import { Transistor, TransistorOptions, createTransistor } from "./runtime/Transistor";
import { createScheduler as callbackScheduler } from "./scheduler/CallableTickScheduler";
import { createScheduler as frameRequestScheduler } from "./scheduler/FrameRequestScheduler";

function create(options?: TransistorOptions): Transistor {

    const instance = createTransistor(options);

    return Object.assign(instance, {
        create,
        scheduler: {
            frameRequest: frameRequestScheduler,
            callback: callbackScheduler,
        },
    });

}

// let instance: Transistor;

// function getInstance(): Transistor {
//     return instance ?? (instance = createTransistor());
// }

// function prepare(): void {
//     getInstance().prepare();
// }

// function execute(): Promise<Element[]> {
//     return getInstance().execute();
// }

// function flip(mutate: FlipFunction): Promise<Element[]> {
//     return getInstance().flip(mutate);
// }

// export default Object.assign(flip.bind(null), {
//     create: createTransistor,
//     prepare,
//     execute,
//     flip,
// });

export default create();
