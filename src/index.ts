import { createTransistor, FlipFunction } from "./Transistor";

const transitor = createTransistor(document.documentElement);

export default Object.assign(function (mutate: FlipFunction) {
    return transitor.flip(mutate);
}, transitor);
