import alt from 'alt-client';
import native from 'natives';
import type { IVector2 } from 'alt-shared';

export function debugPolygon(
    polygon: IVector2[],
    minZ: number,
    maxZ: number,
    r: number = 255,
    g: number = 0,
    b: number = 0,
    a: number = 255,
): void {
    for (const i in polygon) {
        const nextXY = Number(i) !== polygon.length - 1 ? polygon[Number(i) + 1] : polygon[0];

        const CurrentVector = { ...polygon[i], z: minZ };
        const NextVector = { ...nextXY, z: minZ };

        const CurrentVectorUp = new alt.Vector3(CurrentVector.x, CurrentVector.y, maxZ);
        const NextVectorUp = new alt.Vector3(NextVector.x, NextVector.y, maxZ);

        native.drawLine(
            CurrentVector.x,
            CurrentVector.y,
            CurrentVector.z,
            NextVector.x,
            NextVector.y,
            NextVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            CurrentVector.x,
            CurrentVector.y,
            CurrentVector.z,
            CurrentVectorUp.x,
            CurrentVectorUp.y,
            CurrentVectorUp.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            NextVector.x,
            NextVector.y,
            NextVector.z,
            NextVectorUp.x,
            NextVectorUp.y,
            NextVectorUp.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            CurrentVectorUp.x,
            CurrentVectorUp.y,
            CurrentVectorUp.z,
            NextVectorUp.x,
            NextVectorUp.y,
            NextVectorUp.z,
            r,
            g,
            b,
            a,
        );
    }
}
