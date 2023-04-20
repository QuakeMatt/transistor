import { Config, PartialConfig, defaultConfig, mergeConfig } from "./Config";

export interface ConfigManager {
    clone(config?: PartialConfig): ConfigManager;
    configure(config: PartialConfig): ConfigManager;
    configureElements(elements: Iterable<Element>, config: PartialConfig): ConfigManager;
    get(element: Element): Config;
}

export function createConfigManager(baseConfig: Config): ConfigManager {

    const elementConfigs = new WeakMap<Element, Config>();

    const self = {
        clone,
        configure,
        configureElements,
        get: getElementConfig,
    };

    return self;

    function clone(config?: PartialConfig): ConfigManager {
        return createConfigManager(mergeConfig(baseConfig, config));
    }

    function configure(config: PartialConfig): ConfigManager {
        baseConfig = mergeConfig(baseConfig, config);
        return self;
    }

    function configureElements(elements: Iterable<Element>, config: PartialConfig): ConfigManager {

        const stagger = config.stagger ?? 0.0;
        let i = -1;

        for (const element of elements) {
            elementConfigs.set(element, mergeConfig(getElementConfig(element), config, ++i * stagger));
        }

        return self;

    }

    function getElementConfig(element: Element): Config {
        return elementConfigs.get(element) ?? baseConfig;
    }

}

export function createDefaultConfigManager(initial?: PartialConfig): ConfigManager {
    return createConfigManager(defaultConfig);
}
