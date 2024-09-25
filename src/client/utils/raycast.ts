import natives from 'natives';
import type { Vector3 } from 'alt-client';

export function raycast(startPos, endPos, flags, ignoredEntity): [number, boolean, Vector3, Vector3, number] {
    const rayHandle = natives.startExpensiveSynchronousShapeTestLosProbe(
        startPos.x,
        startPos.y,
        startPos.z,
        endPos.x,
        endPos.y,
        endPos.z,
        flags,
        ignoredEntity,
        4,
    );
    return natives.getShapeTestResult(rayHandle);
}
