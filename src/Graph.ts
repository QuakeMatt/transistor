export type WalkVisitor<T> = (node: GraphNode, carry: T) => T;
export type WalkVisitorSuper<T> = (node: GraphNode, carry?: T) => T;
export type WalkVisitorVoid = (node: GraphNode) => void;

export interface GraphNode {
    readonly element: Element;
    readonly isRoot: boolean;
    readonly parent: GraphNode | undefined;
    readonly children: GraphNode[];
}

export interface Graph {
    getRoot(): GraphNode;
    walk<T>(visitor: WalkVisitorVoid): void;
    walk<T>(visitor: WalkVisitor<T>, initial: T): void;
}

const SELECTOR = '[data-transistor]';

function createGraphNode(element: Element, parentNode?: GraphNode): GraphNode {

    const node = {
        element,
        isRoot: ! parentNode,
        parent: parentNode ?? undefined,
        children: [],
    };

    if (parentNode) {
        parentNode.children.push(node);
    }

    return node;

}

function generateGraph(root: Element): GraphNode {

    const nodeMap = new Map<Element, GraphNode>();

    const rootNode = nodeFactory(root);

    root.querySelectorAll<Element>(SELECTOR).forEach(function visit(element) {

        // if (false === element instanceof Element) {
        //     return;
        // }

        if (nodeMap.has(element)) {
            return nodeMap.get(element);
        }

        const parent = element.parentElement?.closest<Element>(SELECTOR) ?? root;
        const parentNode = visit(parent);

        nodeFactory(element, parentNode);

    });

    return rootNode;

    function nodeFactory(element: Element, parentNode?: GraphNode): GraphNode {
        const node = createGraphNode(element, parentNode);
        nodeMap.set(element, node);
        return node;
    }

}

export function createGraph(root: Element): Graph {

    let rootNode: GraphNode | undefined;

    const observer = new MutationObserver(onMutate);

    const observerOptions: MutationObserverInit = {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false,
    };

    return {
        getRoot,
        walk,
    };

    // [].reduce

    function getRoot(): GraphNode {

        if (rootNode) {
            return (0 < observer.takeRecords().length)
                ? (rootNode = generateGraph(root))
                : rootNode;
        }

        observer.observe(root, observerOptions);

        return rootNode = generateGraph(root);

    }

    function onMutate(mutations: MutationRecord[], observer: MutationObserver): void {
        observer.disconnect();
        rootNode = undefined;
    }

    function walk<T>(visitor: WalkVisitorVoid): void;
    function walk<T>(visitor: WalkVisitor<T>, initial: T): void;
    function walk<T>(visitor: WalkVisitorSuper<T>, initial?: T): void {
        (function step(node: GraphNode, carry?: T) {
            const value = visitor(node, carry);
            node.children.forEach(function (node) {
                step(node, value);
            });
        })(getRoot(), initial);
    }

}
