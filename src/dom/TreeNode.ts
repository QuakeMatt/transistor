/**
 * ...
 */
export class TreeNode {

    /**
     * The node's DOM element.
     */
    public readonly element: Element;

    /**
     * The parent of this node.
     */
    public readonly parent: TreeNode | undefined;

    /**
     * The children of this node.
     */
    public readonly children: TreeNode[];

    /**
     * Constructs a new DOM tree node.
     *
     * @param element The node's DOM element.
     * @param parentNode The parent of this node.
     */
    constructor(element: Element, parentNode?: TreeNode) {

        this.element = element;
        this.parent = parentNode;
        this.children = [];

        if (parentNode) {
            parentNode.children.push(this);
        }

    }

}
