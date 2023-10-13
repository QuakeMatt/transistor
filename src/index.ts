import { Runtime } from "./core/Runtime";
import { RuntimeOptions } from "./core/RuntimeOptions";
import { Solution } from "./core/Solution";
import { EasingRegistry } from "./easing/EasingRegistry";
import { SchedulerRegistry } from "./scheduler/SchedulerRegistry";

/**
 * ...
 */
export type FlipFunction = (anim: Transistor) => void;

/**
 * ...
 */
export interface Transistor {
    readonly easing: EasingRegistry;
    readonly scheduler: SchedulerRegistry;

    (mutate: FlipFunction): Solution;
    flip(mutate: FlipFunction): Solution;
    prepare(): void;
    execute(): Solution;
    create(): Transistor;
}

/**
 * ...
 */
function createTransistor(options?: RuntimeOptions): Transistor {

    const runtime = new Runtime(options);

    const instance = function transistor(mutate: (anim: Transistor) => void): Solution {
        return flip(mutate);
    };

    instance.flip = flip;
    instance.prepare = runtime.prepare.bind(runtime);
    instance.execute = runtime.execute.bind(runtime);
    instance.create = createTransistor;

    instance.easing = runtime.registries.easing;
    instance.scheduler = runtime.registries.scheduler;

    return instance;

    function flip(mutate: FlipFunction) {
        runtime.prepare();
        mutate(instance);
        return runtime.execute();
    }

}

// ...
export default createTransistor();
