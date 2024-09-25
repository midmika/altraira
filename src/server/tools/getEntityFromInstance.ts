import type alt from 'alt-server';
import type { IAnyEntity } from '@/types';

export function getEntityFromInstance(entity: alt.Entity | null): IAnyEntity | null {
    if (!entity) return null;

    switch (entity.type) {
        case 0: /* Player */ {
            const candidate: alt.Player = entity as alt.Player;
            if (candidate.$) return candidate.$;
            break;
        }
    }

    return null;
}
