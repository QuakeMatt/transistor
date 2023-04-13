import { FlipFunction, Transistor, createTransistor } from "./runtime/Transistor";

let instance: Transistor;

function getInstance(): Transistor {
    return instance ?? (instance = createTransistor());
}

function prepare(): void {
    getInstance().prepare();
}

function execute(): Promise<Element[]> {
    return getInstance().execute();
}

function flip(mutate: FlipFunction): Promise<Element[]> {
    return getInstance().flip(mutate);
}

export default Object.assign(flip.bind(null), {
    create: createTransistor,
    prepare,
    execute,
    flip,
});
