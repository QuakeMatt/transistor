import { Rectangle } from "./Rectangle";

export interface MutableRectangle extends Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
