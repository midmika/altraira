import type { IVector2 } from 'alt-shared';

export function calculateCentroid(vertices: IVector2[]): IVector2 {
    const n = vertices.length;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0; i < n; i++) {
        centroidX += vertices[i].x;
        centroidY += vertices[i].y;
    }

    return {
        x: centroidX / n,
        y: centroidY / n,
    };
}
