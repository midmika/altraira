import type { IVector3 } from 'alt-shared';
import alt from 'alt-client';

export function rotationToDirection(v: IVector3) {
    return new alt.Vector3(
        -Math.sin(v.z) * Math.abs(Math.cos(v.x)),
        Math.cos(v.z) * Math.abs(Math.cos(v.x)),
        Math.sin(v.x),
    );
}
