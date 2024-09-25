import type { IVector2 } from 'alt-shared';
import type alt_client from 'alt-client';
import type alt_server from 'alt-server';
import type { AbstractVehicle } from '../vehicle/AbstractVehicle';
import type { AbstractCharacter } from '../character/AbstractCharacter';

export abstract class AbstractPolygonColshape<T extends alt_client.ColshapePolygon | alt_server.ColshapePolygon> {
    protected declare _instance: T;
    protected readonly _polygon: IVector2[];

    protected constructor(instance: T, polygon: IVector2[]) {
        this._instance = instance;
        this._polygon = polygon;
    }

    get instance(): T {
        return this._instance;
    }

    get polygon(): IVector2[] {
        return this._polygon;
    }

    destroy(): void {
        this._instance.destroy();
    }

    isEntityInside(entity: AbstractVehicle<any> | AbstractCharacter<any>): boolean {
        return this._instance.isEntityIn(entity.instance);
    }
}
