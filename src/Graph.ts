


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
    readonly getRoot: () => GraphNode;
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

    let rootNode: GraphNode | null = null;

    // const rootNode = generateGraph(root);

    const observer = new MutationObserver(onMutate);

    const observerOptions: MutationObserverInit = {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false,
    };


    // console.log(generateGraph(root));




    // function forEach(fn: Mungus): void {

    // }

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

        console.log('Regenerating graph...');

        observer.observe(root, observerOptions);

        return rootNode = generateGraph(root);

    }

    function onMutate(mutations: MutationRecord[], observer: MutationObserver): void {
        console.log('onMutate');
        // console.log(`there are ${mutations.length} mutations`);
        // mutations.forEach(m => console.log(m));
        observer.disconnect();
        rootNode = null;
    }

    function forEach(callback: Mungus) {

        (function cb(node: GraphNode) {
            callback(node);
            node.children.forEach(cb);
        })(getRoot());

    }

    // function forEach(callback: Mungus) {
    //     _forEach(callback, rootNode);
    // }

    // function _forEach(callback: Mungus, node: GraphNode) {
    //     callback(node);
    //     node.children.forEach(_forEach.bind(null, callback));
    // }

}
