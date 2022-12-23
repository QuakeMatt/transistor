


export interface GraphNode {
    readonly element: HTMLElement;
    readonly isRoot: boolean;
    readonly parent: GraphNode | null;
    readonly children: GraphNode[];
}

// export interface GraphRoot extends GraphNode {
//     forEach: (callback: (node: GraphNode) => void) => void;
//     // spoot: boolean;
// }

export function createGraphNode(element: HTMLElement, parentNode?: GraphNode | null): GraphNode {

    const node = {
        element,
        isRoot: null == parentNode,
        parent: parentNode ?? null,
        children: [],
    };

    if (parentNode) {
        parentNode.children.push(node);
    }

    return node;

}

// export function createGraphRoot(node: GraphNode, nodes: GraphNode[]): GraphRoot {

//     return {
//         element: node.element,
//         parent: node.parent,
//         children: node.children,
//         forEach:
//     };

// }


// ---



const SELECTOR = '[data-transistor]';

type Mungus = (node: GraphNode) => void;

export interface Graph {
    readonly rootNode: GraphNode;
    readonly forEach: (callback: Mungus) => void;
}

function generateGraph(root: HTMLElement): GraphNode {

    const nodeMap = new Map<HTMLElement, GraphNode>();

    const rootNode = nodeFactory(root);

    root.querySelectorAll<HTMLElement>(SELECTOR).forEach(function visitElement(element) {

        if (false === element instanceof HTMLElement) {
            return;
        }

        if (nodeMap.has(element)) {
            return nodeMap.get(element) as GraphNode;
        }

        const parent = element.parentElement?.closest<HTMLElement>(SELECTOR) ?? root;
        const parentNode = visitElement(parent);

        nodeFactory(element, parentNode);

    });

    return rootNode;

    function nodeFactory(element: HTMLElement, parentNode?: GraphNode | null): GraphNode {
        const node = createGraphNode(element, parentNode);
        nodeMap.set(element, node);
        return node;
    }

}

export function createGraph(root: HTMLElement): Graph {

    const rootNode = generateGraph(root);


    // console.log(generateGraph(root));




    // function forEach(fn: Mungus): void {

    // }

    return {
        rootNode,
        forEach,
    };

    function forEach(callback: Mungus) {

        (function cb(node: GraphNode) {
            callback(node);
            node.children.forEach(cb);
        })(rootNode);

    }

    // function forEach(callback: Mungus) {
    //     _forEach(callback, rootNode);
    // }

    // function _forEach(callback: Mungus, node: GraphNode) {
    //     callback(node);
    //     node.children.forEach(_forEach.bind(null, callback));
    // }

}
