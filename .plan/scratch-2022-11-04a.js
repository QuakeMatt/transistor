/**
 * ...
 */
function Graph() {

}

/**
 * ...
 */
function Snapshot() {
    this.element = HTMLElement;
    this.rect = DOMRect;
    this.opacity = Number;
}

/**
 * ...
 */
function Transition() {
    this.parent = Transition;
    this.from = Snapshot;
    this.to = Snapshot;
}

/**
 * ...
 */
function Process() {
    this.graph = Graph;
    this.transitions = [Transition];
}

/**
 * ...
 */
function Transistor() {

    function prepare() {
    }

    function execute() {
    }

}
