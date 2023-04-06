import { MutableRectangle, Rectangle, createMutableRectangle } from "../geometry/Rectangle";

export interface Delta {
    readonly rectangle: Rectangle;
};

export interface MutableDelta {
    rectangle: MutableRectangle;
}

export function createDelta(rectangle: Rectangle): Delta {
    return {
        rectangle,
    };
}

export function createMutableDelta(rectangle?: MutableRectangle): MutableDelta {
    return createDelta(rectangle ?? createMutableRectangle());
}
