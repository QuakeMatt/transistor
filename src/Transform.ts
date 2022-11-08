// 2D matrix pattern: "matrix(a, b, c, d, tx, ty)"
// @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
const matrixPattern = /^matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)\)$/;

export interface Transform {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export function createTransform(x: number, y: number, width: number, height: number): Transform {
    return { x, y, width, height };
}

export const IDENTITY_TRANSFORM = createTransform(0.0, 0.0, 1.0, 1.0);

export function createTransformFromString(transform: string): Transform {

    if (transform === 'none') {
        return IDENTITY_TRANSFORM;
    }

    const matrix = matrixPattern.exec(transform);
    if (matrix) {
        return createTransform(+matrix[5], +matrix[6], +matrix[1], +matrix[4]);
    }

    return IDENTITY_TRANSFORM;

}

export function createTransformFromElement(element: Element): Transform {
    const transform = getComputedStyle(element).getPropertyValue('transform')
    return createTransformFromString(transform);
}


// export class Transform {

//     readonly x: number;
//     readonly y: number;
//     readonly width: number;
//     readonly height: number;

//     /**
//      * Constructs a transform.
//      * @param x
//      * @param y
//      * @param width
//      * @param height
//      */
//     constructor(x: number, y: number, width: number, height: number) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//     }

//     /**
//      * Constructs a transform from the given string.
//      * @param transform
//      */
//     static fromString(transform: string): Transform {

//         if (transform === 'none') {
//             return IDENTITY;
//         }

//         const matrix = matrixPattern.exec(transform);
//         if (matrix) {
//             return new Transform(+matrix[5], +matrix[6], +matrix[1], +matrix[4]);
//         }

//         return IDENTITY;

//     }

//     /**
//      * Constructs a transform from the given element.
//      * @param element
//      */
//     static fromElement(element: Element): Transform {
//         const transform = getComputedStyle(element).getPropertyValue('transform')
//         return Transform.fromString(transform);
//     }
// }

// export const IDENTITY = new Transform(0, 0, 1, 1);


