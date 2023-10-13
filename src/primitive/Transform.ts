export class Transform {

    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

}

export const IDENTITY_TRANSFORM = new Transform(0.0, 0.0, 1.0, 1.0);
