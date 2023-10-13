import { Scheduler } from "../scheduler/Scheduler";

export interface RuntimeOptions {
    root?: Element;
    selector?: string;
    scheduler?: Scheduler;
}

export function validateOptions(options: RuntimeOptions | undefined): RuntimeOptions {
    return options ?? {};
}
