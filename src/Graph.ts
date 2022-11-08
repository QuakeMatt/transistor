// type NodeMap = Map<Element, GraphNode>;

// type NodeCallback = (value: GraphNode, key: Element, map: NodeMap) => void;

// class GraphNode {
//     constructor(readonly element: Element) {
//     }
// }

// export class Graph {

//     private readonly nodes: NodeMap;

//     constructor(root: Element, selector: string) {

//         const nodes = this.nodes = new Map();

//         root.querySelectorAll(selector).forEach(function visit(element) {
//             nodes.set(element, new GraphNode(element));
//         });

//     }

//     forEach(fn: NodeCallback) {
//         this.nodes.forEach(fn);
//     }

// }


export type GraphNodeMap = Map<Element, GraphNode>;

export type GraphNodeForEach = (value: GraphNode, key: Element, map: GraphNodeMap) => void;

export interface GraphNode {
    element: Element;
}

export interface Graph {
    forEach: (callback: GraphNodeForEach, thisArg?: any) => void;
}

export function createGraphNode(element: Element): GraphNode {

    return {
        element,
    };

}

export function createGraph(root: Element, selector: string): Graph {

    const nodes: GraphNodeMap = new Map();

    root.querySelectorAll(selector).forEach(function visit(element) {
        nodes.set(element, createGraphNode(element));
    });

    return {
        forEach: nodes.forEach.bind(nodes),
    };

}
