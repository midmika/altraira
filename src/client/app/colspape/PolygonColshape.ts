import * as alt from 'alt-client';
import type { IVector2 } from 'alt-shared';
import { debugPolygon } from '@/utils/debugPolygon';
import type { IRGBA } from '@shared/types';
import { AbstractPolygonColshape } from '@shared/app/colshape/AbstractPolygonColshape';

export class PolygonColshape extends AbstractPolygonColshape<alt.ColshapePolygon> {
    declare _instance: alt.Colshape;
    declare _debugTimer: number;
    declare _polygon: IVector2[];

    constructor(polygon: IVector2[]) {
        let instance: alt.ColshapeCylinder;
        while (true) {
            // Колшейп создается абсолютно рандомно
            try {
                instance = new alt.ColshapePolygon(
                    -10000,
                    10000,
                    polygon.map((i) => new alt.Vector2(i)),
                );
                break;
            } catch (error) {}
        }
        super(instance, polygon);
        instance.$ = this;
    }

    debugThisFrame(extra?: { color?: IRGBA; height?: number }): void {
        debugPolygon(
            this._polygon.map((i) => ({ x: i.x, y: i.y })),
            -20,
            -20 + (extra?.height ?? 150),
            ...(extra?.color ?? [255, 0, 0, 255]),
        );
    }

    destroy(): void {
        this._instance.destroy();
    }
}
