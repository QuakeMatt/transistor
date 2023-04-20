import { EasingFunction } from "../tween/EasingFunction";

export interface Config {
    readonly delay: number;
    readonly duration: number;
    readonly easing: EasingFunction | string;
}

export interface PartialConfig extends Partial<Config> {
    readonly stagger?: number;
}

export const defaultConfig: Config = {
    delay: 0.0,
    duration: 400.0,
    easing: 'ease',
};

export function mergeConfig(initial: Config, partial: PartialConfig = {}, stagger: number = 0.0): Config {
    return {
        delay: (partial.delay ?? initial.delay) + stagger,
        duration: partial.duration ?? initial.duration,
        easing: partial.easing ?? initial.easing,
    };
}
