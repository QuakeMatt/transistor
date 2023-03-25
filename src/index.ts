import { FlipFunction, Transistor, createTransistor } from "./Transistor";

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

export default Object.assign(flip.bind(null), {
    create: createTransistor,
    prepare,
    execute,
    flip,
});
