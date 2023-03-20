import { createTransistor, FlipFunction, Transistor } from "./Transistor";

// const transitor = createTransistor();

// export default Object.assign(function (mutate: FlipFunction) {
//     return transitor.flip(mutate);
// }, {create: createTransistor}, transitor);

let instance: Transistor;

function getInstance(): Transistor {
    return instance ?? (instance = createTransistor());
}

function prepare(): void {
    getInstance().prepare();
}

function execute(): void {
    getInstance().execute();
}

function flip(mutate: FlipFunction): void {
    getInstance().flip(mutate);
}

export default Object.assign(function (mutate: FlipFunction) {
    getInstance().flip(mutate);
}, {
    create: createTransistor,
    prepare,
    execute,
    flip,
});
