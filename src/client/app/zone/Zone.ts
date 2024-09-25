import type { IVector2 } from 'alt-shared';
import type { PolygonColshape } from '@/app/colspape/PolygonColshape';
import type { IZoneDto } from '@shared/app/zone/AbstractZone';
import { AbstractZone } from '@shared/app/zone/AbstractZone';
import { calculateCentroid } from '@shared/utils/calculateCentroid';
import { drawText3d } from '@/utils/text';
import type { IRGBA } from '@shared/types';

export class Zone extends AbstractZone {
    private readonly _id: number;
    protected declare _name: string;
    protected declare _hash: string;
    protected declare _polygon: IVector2[];
    protected declare _wrapperColshape: PolygonColshape;
    private readonly _centroid: IVector2;
    private readonly __debug_height: number;
    private __debug_color: IRGBA = [255, 255, 255, 255];

    constructor(dto: IZoneDto, wrapperColshape: PolygonColshape) {
        super(dto, wrapperColshape);
        this._id = dto.id;
        this.__debug_height = dto._debug_height;
        this._centroid = calculateCentroid(dto.polygon);
    }

    get id(): number {
        return this._id;
    }

    get debug_height(): number {
        return this.__debug_height;
    }

    debugThisFrame(): void {
        this._wrapperColshape.debugThisFrame({ height: this.__debug_height, color: this.__debug_color });
        drawText3d(
            `Zone <${this._hash}>`,
            { ...this._centroid, z: this.__debug_height },
            0.4,
            2,
            this.__debug_color,
            true,
            true,
        );
    }

    overwriteDebugColor(color: IRGBA = [255, 255, 255, 255]): void {
        this.__debug_color = color;
        // this.__debug_is_next_frame_overwrite_color = true;
        // alt.nextTick(() => {
        //     this.__debug_color = color;
        //     alt.nextTick(() => {
        //         if (!this.__debug_is_next_frame_overwrite_color) this.__debug_color = [255, 255, 255, 255];
        //     });
        // });
    }

    destroy(): void {
        this._wrapperColshape.destroy();
    }

    serialize(): IZoneDto {
        return {
            name: this._name,
            hash: this._hash,
            id: this._id,
            _debug_height: this.__debug_height,
            polygon: this._polygon,
        };
    }
}
