import { Registries } from "../config/Registries";
import { DEFAULT_SELECTOR, Tree } from "../dom/Tree";
import { EasingRegistry } from "../easing/EasingRegistry";
import { ActiveMotions } from "../motion/ActiveMotions";
import { AnimationFrameScheduler } from "../scheduler/AnimationFrameScheduler";
import { Scheduler } from "../scheduler/Scheduler";
import { SchedulerRegistry } from "../scheduler/SchedulerRegistry";
import { KnownStates } from "../state/KnownStates";
import { Engine } from "./Engine";
import { RuntimeOptions, validateOptions } from "./RuntimeOptions";
import { Solution } from "./Solution";
import { Solver } from "./Solver";

/**
 * ...
 */
export class Runtime {

    public readonly tree: Tree;

    public readonly engine: Engine;

    public readonly scheduler: Scheduler;

    public readonly registries: Registries;

    public readonly activeMotions = new ActiveMotions();

    public readonly knownStates = new KnownStates();

    private solver: Solver | undefined;

    constructor(options?: RuntimeOptions) {

        options = validateOptions(options);

        this.tree = new Tree(
            options.root ?? document.documentElement,
            options.selector ?? DEFAULT_SELECTOR
        );

        this.engine = new Engine(this.tree, this.activeMotions, this.knownStates);

        this.scheduler = options.scheduler ?? new AnimationFrameScheduler();

        this.registries = new Registries(
            new EasingRegistry(),
            new SchedulerRegistry(),
        );

    }

    tick = (time: number): void => {

        if (this.solver) {
            throw new Error('Solver still active');
        }

        if (this.engine.tick(time)) {
            this.scheduler.schedule(this.tick);
        }

    }

    prepare(): void {

        if (this.solver) {
            throw new Error('Solver already exists');
        }

        this.scheduler.schedule(this.tick);

        this.solver = new Solver(this.tree, this.scheduler.now());

    }

    execute(): Solution {

        if ( ! this.solver) {
            throw new Error('No active solver');
        }

        this.solver.solve(this.activeMotions, this.knownStates);
        this.solver = undefined;

        return new Solution();

    }

}
