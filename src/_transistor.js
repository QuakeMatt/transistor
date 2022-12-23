window.transistor = (function ($) {

    const rAF = requestAnimationFrame;
    const cAF = cancelAnimationFrame;

    /** @type {Object<string, function>} */
    const easings = Object.create($.easing);

    /**
     * @param {string|function} easing
     * @return {function}
     */
    function getEasingFn(easing) {
        return (typeof easing === 'function') ? easing : (easings[easing] || easings._default);
    }

    /**
     * @param {*} arrayLike
     * @return {Array}
     */
    function arrayFrom(arrayLike) {
        return Array.from ? Array.from(arrayLike) : $.makeArray(arrayLike);
    }

    /** @type {WeakMap<HTMLElement, Transistor>} */
    const instanceMap = new WeakMap();

    // 2D matrix pattern: "matrix(a, b, c, d, tx, ty)"
    // @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
    const matrixPattern = /^matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)\)$/;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @constructor
     */
    function Rectangle(x, y, w, h) {
        this.x = +x;
        this.y = +y;
        this.w = +w;
        this.h = +h;
    }

    /**
     * @param {DOMRect} bounds
     * @return {Rectangle|null}
     */
    Rectangle.fromBounds = function fromBounds(bounds) {
        return (0.0 === bounds.left && 0.0 === bounds.right && 0.0 === bounds.width && 0.0 === bounds.height)
            ? null
            : new Rectangle(bounds.left, bounds.top, bounds.width, bounds.height);
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @constructor
     */
    function Transform(x, y, w, h) {
        this.x = +x;
        this.y = +y;
        this.w = +w;
        this.h = +h;
    }

    /**
     * @param {string} string
     * @return {Transform}
     */
    Transform.fromString = function fromString(string) {

        // No transform
        if ('none' === string) {
            return IDENTITY_TRANSFORM;
        }

        // 2D matrix transform
        const t = matrixPattern.exec(string);
        if (null != t) {
            return new Transform(+t[5], +t[6], +t[1], +t[4]);
        }

        // Unknown transform
        return IDENTITY_TRANSFORM;

    };

    /**
     * @param {Rectangle|null} rectangle
     * @param {Transform} transform
     * @param {number} opacity
     * @param {string} display
     * @constructor
     */
    function Snapshot(rectangle, transform, opacity, display) {
        this.rectangle = rectangle;
        this.transform = transform;
        this.opacity = +opacity;
        this.display = display;
    }

    /**
     * @param {HTMLElement} element
     * @return {Snapshot}
     */
    Snapshot.fromElement = function fromElement(element) {
        const styles = window.getComputedStyle(element);
        return new Snapshot(
            Rectangle.fromBounds(element.getBoundingClientRect()),
            Transform.fromString(styles.getPropertyValue('transform')),
            1.0 * styles.getPropertyValue('opacity'),
            styles.getPropertyValue('display')
        );
    };

    const IDENTITY_RECTANGLE = new Rectangle(0.0, 0.0, 1.0, 1.0);
    const IDENTITY_TRANSFORM = new Transform(0.0, 0.0, 1.0, 1.0);
    const IDENTITY_SNAPSHOT = new Snapshot(IDENTITY_RECTANGLE, IDENTITY_TRANSFORM, 1.0, 'block');

    /**
     * @param {Map<HTMLElement, Snapshot>} startStates
     * @param {Map<HTMLElement, Snapshot>} finalStates
     */
    function extrapolateSnapshots(startStates, finalStates) {

        startStates.forEach(function (startState, element) {

            let finalState = finalStates.get(element);
            if (null == finalState) {
                return;
            }

            if (null == startState.rectangle) {
                startState.rectangle = finalState.rectangle;
                startState.display = finalState.display;
                startState.opacity = 0;
            }

            if (null == finalState.rectangle) {
                finalState.rectangle = startState.rectangle;
                finalState.display = startState.display;
                finalState.opacity = 0;
            }

            // FIXME: Replace hardcoded behaviour with per-element configuration
            if ($(element).hasClass('nav-search-form__input')) {
                startState.rectangle.w = finalState.rectangle.w * (startState.rectangle.h / finalState.rectangle.h);
            }

        });

    }

    /**
     * @param {HTMLElement} element
     * @param {GraphNode|null} parentNode
     * @constructor
     */
    function GraphNode(element, parentNode) {

        /** @type {GraphNode[]} */
        const childNodes = [];

        /** @type {boolean} */
        const isRoot = !parentNode;

        /**
         * @param {function} fn
         * @param {Map<HTMLElement, Snapshot>} map
         */
        function takeSnapshot(fn, map) {
            map.set(element, isRoot ? IDENTITY_SNAPSHOT : fn(element));
        }

        // Public properties
        this.element = element;
        this.parentNode = parentNode;
        this.childNodes = childNodes;

        // Public methods
        this.push = childNodes.push.bind(childNodes);
        this.takeSnapshot = takeSnapshot;

        // Attach to parent node
        if (parentNode) {
            parentNode.push(this);
        }

    }

    /**
     * @param {HTMLElement[]} elements
     * @constructor
     */
    function Graph(elements) {

        const rootNode = new GraphNode(document.documentElement, null);

        /** @type {Map<HTMLElement, GraphNode>} */
        const nodeRegistry = new Map();

        /**
         * @param {HTMLElement} element
         * @param {GraphNode|null} parentNode
         * @return {GraphNode}
         */
        function createNode(element, parentNode) {
            const node = new GraphNode(element, parentNode);
            nodeRegistry.set(element, node);
            return node;
        }

        /**
         * @param {function} fn
         * @param {Map<HTMLElement, Snapshot>} map
         */
        function takeSnapshot(fn, map) {
            nodeRegistry.forEach(function (node) {
                node.takeSnapshot(fn, map);
            })
        }

        // Public properties
        this.rootNode = rootNode;

        // Public methods
        this.forEach = nodeRegistry.forEach.bind(nodeRegistry);
        this.takeSnapshot = takeSnapshot;

        // Build the element graph
        elements.forEach(function visitElement(element) {

            // Return existing node, if this element has already been visited
            if (nodeRegistry.has(element)) {
                return nodeRegistry.get(element);
            }

            // Attach to a parent node, if this element is nested inside another
            let parentElement = element;
            while ((parentElement = parentElement.parentElement)) {
                if (-1 !== elements.indexOf(parentElement)) {
                    return createNode(element, visitElement(parentElement));
                }
            }

            // Attack to the root node, if this element is not nested
            return createNode(element, rootNode);

        });

    }

    /**
     * @param {Graph} graph
     * @param {number} duration
     * @param {function} easeFn
     * @param {function} mutate
     * @constructor
     */
    function Animator(graph, duration, easeFn, mutate) {

        /** @type {Map<HTMLElement, Snapshot>} */
        const startStates = new Map();

        /** @type {Map<HTMLElement, Snapshot>} */
        const finalStates = new Map();

        /** @type {number} */
        let rAFID = 0;

        /** @type {number} */
        let startTime = 0.0;

        /** @type {function} */
        let done = $.noop;

        /** @type {Promise<boolean>} */
        const promise = new Promise(function (resolve) {
            done = resolve;
        });

        /**
         * @param {number} progress
         * @param {number} start
         * @param {number} final
         * @return {number}
         */
        function ease(progress, start, final) {
            const ratio = easeFn(progress, progress, 0.0, 1.0, 1.0);
            return start * (1.0 - ratio) + final * ratio;
        }

        /**
         * @param {number} progress
         * @param {number} start
         * @param {number} final
         * @return {number}
         */
        function translate(progress, start, final) {
            return ease(progress, start - final, 0.0);
        }

        /**
         * @param {number} progress
         * @param {number} start
         * @param {number} final
         * @return {number}
         */
        function scale(progress, start, final) {
            return ease(progress, start / final, 1.0);
        }

        /**
         * @param {GraphNode} node
         * @param {number} progress
         * @param {Snapshot} parentState
         */
        function transformNode(node, progress, parentState) {

            const startState = startStates.get(node.element);
            const startRectangle = startState.rectangle;

            if (null == startRectangle) {
                return;
            }

            const finalState = finalStates.get(node.element);
            const finalRectangle = finalState.rectangle;
            const finalTransform = finalState.transform;

            const parentRectangle = parentState.rectangle;
            const parentTransform = parentState.transform;

            const localTransform = new Transform(
                translate(progress, startRectangle.x, finalRectangle.x),
                translate(progress, startRectangle.y, finalRectangle.y),
                scale(progress, startRectangle.w, finalRectangle.w),
                scale(progress, startRectangle.h, finalRectangle.h)
            );

            const localRectangle = new Rectangle(
                finalRectangle.x + localTransform.x,
                finalRectangle.y + localTransform.y,
                finalRectangle.w * localTransform.w,
                finalRectangle.h * localTransform.h
            );

            const localOpacity = ease(progress, startState.opacity, finalState.opacity);

            const rx = localRectangle.x - parentRectangle.x;
            const ry = localRectangle.y - parentRectangle.y;

            const tx = localTransform.x - parentTransform.x + rx / parentTransform.w - rx + finalTransform.x;
            const ty = localTransform.y - parentTransform.y + ry / parentTransform.h - ry + finalTransform.y;
            const tw = localTransform.w / parentTransform.w * finalTransform.w;
            const th = localTransform.h / parentTransform.h * finalTransform.h;

            const to = Math.min(localOpacity / parentState.opacity, 1.0);

            node.element.style.willChange = 'opacity, transform';
            node.element.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + tw + ', ' + th + ')';
            node.element.style.display = finalState.display;
            node.element.style.opacity = to.toString();

            transformNodeChildren(node, progress, new Snapshot(
                localRectangle,
                localTransform,
                localOpacity,
                finalState.display
            ));

        }

        /**
         * @param {GraphNode} node
         * @param {number} progress
         * @param {Snapshot} parentState
         */
        function transformNodeChildren(node, progress, parentState) {

            node.childNodes.forEach(function (childNode) {
                transformNode(childNode, progress, parentState)
            });

        }

        /**
         * @param {Graph} graph
         * @param {number} progress
         */
        function transformGraph(graph, progress) {
            transformNodeChildren(graph.rootNode, progress, IDENTITY_SNAPSHOT);
        }

        /**
         * @param {Graph} graph
         */
        function resetTransforms(graph) {
            graph.forEach(function (node) {
                node.element.style.willChange = '';
                node.element.style.transform = '';
                node.element.style.display = '';
                node.element.style.opacity = '';
            });
        }

        /**
         * @param {number} timestamp
         */
        function tick(timestamp) {
            const progress = (duration > 0.0) ? Math.min((timestamp - startTime) / duration, 1.0) : 1.0;
            transformGraph(graph, progress);

            // Not yet finished - schedule another frame
            if (progress < 1.0) {
                rAFID = rAF(tick);
            }

            // Animation finished - resolve promise with ended = true
            else {
                rAFID = 0;
                done(true);
            }
        }

        /**
         */
        function stop() {

            // No frame scheduled - early exit
            if (0 === rAFID) {
                return;
            }

            // Cancel the upcoming frame
            cAF(rAFID);
            rAFID = 0;

            // Done, with ended = false
            done(false);
        }

        // Take snapshots, mutate state, and begin the transition
        rAFID = rAF(function (timestamp) {
            startTime = timestamp - (1.0 / 60.0);
            graph.takeSnapshot(Snapshot.fromElement, startStates);
            resetTransforms(graph);
            mutate(startStates);
            graph.takeSnapshot(Snapshot.fromElement, finalStates);
            extrapolateSnapshots(startStates, finalStates);
            tick(timestamp);
        });

        /**
         * @return {boolean}
         */
        function isRunning() {
            return (0 !== rAFID);
        }

        // Public methods
        this.stop = stop;
        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);
        // this.finally = promise.finally.bind(promise);
        this.isRunning = isRunning;

        // Remove transition state once the animation has completed
        promise.then(function (ended) {
            if (ended) {
                resetTransforms(graph);
            }
        });

    }

    /**
     * @param {HTMLElement[]} elements
     * @constructor
     */
    function Transistor(elements) {

        /** @type {Graph} */
        const graph = new Graph(elements);

        /** @type {Animator|null} */
        let animator = null;

        /**
         * @param {number} duration
         * @param {string|function} easing
         * @param {function} mutate
         * @return {Animator}
         */
        function flip(duration, easing, mutate) {
            animator && animator.stop();
            return animator = new Animator(graph, duration, getEasingFn(easing), mutate);
        }

        /**
         */
        function stop() {
            animator && animator.stop();
            animator = null;
        }

        /**
         * @return {boolean}
         */
        function isRunning() {
            return (null != animator) && animator.isRunning();
        }

        // Public methods
        this.flip = flip;
        this.stop = stop;
        this.isRunning = isRunning;

    }

    /**
     * @param {HTMLElement[]} elements
     */
    function transistor(elements) {

        elements = arrayFrom(elements);

        const instance = new Transistor(elements);

        elements.forEach(function (element) {
            const currentInstance = instanceMap.get(element);
            currentInstance && currentInstance.stop();
            instanceMap.set(element, instance);
        });

        return instance;

    }

    /**
     * @param {HTMLElement[]} elements
     * @param {number} duration
     * @param {function|string} easing
     * @param {function} mutate
     * @return {Animator}
     */
    transistor.flip = function flip(elements, duration, easing, mutate) {
        return transistor(elements).flip(duration, easing, mutate);
    };

    // Export public API
    return transistor;

}(jQuery));
