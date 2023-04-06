import { Rectangle, createRectangle } from "./Rectangle";

export interface Transform extends Rectangle {};

export const createTransform: (x: number, y: number, width: number, height: number) => Transform = createRectangle;

export const IDENTITY_TRANSFORM = createTransform(0.0, 0.0, 1.0, 1.0);
