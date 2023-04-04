
export interface Matrix {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export interface MutableMatrix {
    x: number;
    y: number;
    z: number;
}

export function createMatrix(): Matrix {
    return {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
}

const immutable: Matrix = createMatrix();
const mutable: MutableMatrix = createMatrix();

const fromImmutable: MutableMatrix = immutable;
const fromMutable: Matrix = mutable;

fromImmutable.x = 1.0;
fromMutable.x = 1.0;
