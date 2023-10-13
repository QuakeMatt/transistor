import { EasingRegistry } from "../easing/EasingRegistry";
import { SchedulerRegistry } from "../scheduler/SchedulerRegistry";

/**
 * ...
 */
export class Registries {

    /**
     * ...
     */
    public readonly easing: EasingRegistry;

    /**
     * ...
     */
    public readonly scheduler: SchedulerRegistry;

    /**
     * ...
     * @param easing ...
     * @param scheduler ...
     */
    constructor(easing: EasingRegistry, scheduler: SchedulerRegistry) {
        this.easing = easing;
        this.scheduler = scheduler;
    }

}
