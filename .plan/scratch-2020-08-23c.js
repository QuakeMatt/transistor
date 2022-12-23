/**
 * Graph represents the hierarchy of transistor nodes.
 *   - Self-updating
 *   - Iterable
 */
function Graph() {
    this.root = Element;
    this.nodes = Map;
    function forEach(callback) { return null };
}

/**
 * Snapshot represents the visual state of an element at a given moment.
 * Snapshots are taken before and after the DOM is mutated, then compared
 * to decide what transition to perform.
 */
function Snapshot() {
    this.rectangle = DOMRect;
    this.transform = DOMRect;
}

/**
 * Tween represents an
 */
function Tween() {
    this.easing = String;
    this.delay = Number;
    this.duration = Number;
    function createFrom(options, tween) { return Tween };
}

/**
 * ...
 */
function MultiTween() {
    this.tx = Tween;
    this.ty = Tween;
    this.sx = Tween;
    this.sy = Tween;
}

/**
 * ...
 */
function Change() {
    this.tween = Tween;
    this.start = Snapshot;
    this.end = Snapshot;
}

/**
 * ...
 */
function ChangeTracker() {
    this.defaultTween = Tween;
    function set(element, changes) { return Change }
    function diff() { return Map }
}

/**
 * ...
 */
function Transistor() {
    function flip(callback) { return Promise }
}
