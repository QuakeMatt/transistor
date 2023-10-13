export class Rectangle {

    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;

    constructor(x?: number, y?: number, width?: number, height?: number) {
        this.x = x ?? 0.0;
        this.y = y ?? 0.0;
        this.width = width ?? 0.0;
        this.height = height ?? 0.0;
    }

    static fromElement(element: Element): Rectangle | undefined {

        if (0 === element.getClientRects().length) {
            return undefined;
        }

        const rect = element.getBoundingClientRect();
        return new Rectangle(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
        );

    }

    getRelative(other: Rectangle): Rectangle {
        return new Rectangle(
            this.x - other.x,
            this.y - other.y,
            this.width,
            this.height,
        );
    }

    getDelta(other: Rectangle): Rectangle {
        return new Rectangle(
            other.x - this.x,
            other.y - this.y,
            other.width - this.width,
            other.height - this.height,
        );
    }

}
