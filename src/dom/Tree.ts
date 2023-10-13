import { TreeNode } from "./TreeNode";

/**
 * The default CSS selector for locating Transistor-managed elements.
 */
export const DEFAULT_SELECTOR = '[data-transistor]';

/**
 * ...
 */
export class Tree {

    /**
     * The root node of the tree.
     */
    public readonly root: TreeNode;

    /**
     * Constructs a new DOM tree.
     *
     * @param root The root DOM element for this tree.
     */
    constructor(root: Element, selector: string) {

        const nodeMap = new Map<Element, TreeNode>();

        this.root = createNode(root);

        function createNode(element: Element, parentNode?: TreeNode): TreeNode {
            const node = new TreeNode(element, parentNode);
            nodeMap.set(element, node);
            return node;
        }

        root.querySelectorAll<Element>(selector).forEach(function visit(element) {

            if (nodeMap.has(element)) {
                return nodeMap.get(element);
            }

            const parent = element.parentElement?.closest<Element>(selector) ?? root;
            const parentNode = visit(parent);

            createNode(element, parentNode);

        });

    }

    /**
     * Executes the provided callback once for each node in the tree.
     *
     * @param callback The function to execute for each node in the tree.
     */
    forEach(callback: (node: TreeNode) => void) {

        (function cb(node: TreeNode) {
            callback(node);
            node.children.forEach(cb);
        })(this.root);

    }

}
