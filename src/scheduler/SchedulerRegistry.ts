import { AnimationFrameScheduler } from "./AnimationFrameScheduler";
import { CallableTickReceiver, CallableTickScheduler } from "./CallableTickScheduler";

export class SchedulerRegistry {

    animation(): AnimationFrameScheduler {
        return new AnimationFrameScheduler();
    }

    callback(receiver: CallableTickReceiver): CallableTickScheduler {
        return new CallableTickScheduler(receiver);
    }

}
