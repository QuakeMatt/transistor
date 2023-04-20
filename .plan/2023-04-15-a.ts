interface Config {
    delay?: number;
    duration?: number;
    easing?: Function | string;
}

// ---

const html = `<div data-transistor='{"duration":500.0}'></div>`;

const defaults = {
    delay: 0.0,
    duration: 800.0,
    easing: 'ease',
};

function prepare() {}

function execute() {}

function flip(fn: Function) {}

interface Pulse extends Record<string, Function> {
    (elements: Element[], fn: Function): Transistor;
}

interface Transistor {
    readonly easing: Readonly<Record<string, Function>>;
    readonly pulse: Pulse;
    defaults(config: Config): Transistor;
    configure(config: Config): Transistor;
    configure(element: Element, config: Config): Transistor;
    configure(elements: Element[], config: Config): Transistor;
    stagger(elements: Element[], stagger: number): Transistor;
    // pulse(elements: Element[], fn: Function): Transistor;
    mutate(fn: Function): Transistor;
}

interface Mutator {
}

// ---

flip(function (anim: Transistor) {

    anim.configure({
        duration: 400,
    });

    document.querySelectorAll<HTMLUListElement>('ul').forEach(function (ul) {
        const items = Array.from(ul.children);

        anim.configure(ul, { easing: anim.easing.linear })
            .stagger(items, 100)
            .pulse(items, anim.pulse.scale(1.2))
            .pulse(items, anim.pulse.swing(1.2))
            // .pulse(items, function () {})
            // .mutate(function (mutator: Mutator) {
            // })
        ;

        items.forEach(li => li.remove());
        items.sort();
        ul.append(...items);
    });

});
