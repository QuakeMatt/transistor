type ForEachCallback = (node: GraphNode) => void;

export interface GraphNode {
    readonly element: Element;
    /* readonly isRoot: boolean; */
    readonly children: GraphNode[];
    readonly parent: GraphNode | undefined;
}

export interface Graph {
    getRoot(): GraphNode;
    forEach(callback: ForEachCallback): void;
}

const SELECTOR = '[data-transistor]';

function createGraphNode(element: Element, parentNode?: GraphNode): GraphNode {

    const node = {
        element,
        /* isRoot: ! parentNode, */
        parent: parentNode,
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
        forEach,
    };

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

    function forEach(callback: ForEachCallback): void {

        (function cb(node: GraphNode) {
            callback(node);
            node.children.forEach(cb);
        })(getRoot());

    }

}
