import type { IVector3 } from 'alt-shared';
import type alt_client from 'alt-client';
import type alt_server from 'alt-server';
import type { AbstractVehicle } from '../vehicle/AbstractVehicle';
import type { AbstractCharacter } from '../character/AbstractCharacter';

export abstract class AbstractSphereColshape<T extends alt_client.ColshapeSphere | alt_server.ColshapeSphere> {
    protected declare _instance: T;
    protected _pos: IVector3;
    protected _radius: number;

    protected constructor(instance: T, pos: IVector3, radius: number) {
        this._instance = instance;
        this._pos = pos;
        this._radius = radius;
    }

    get instance(): T {
        return this._instance;
    }

    get pos(): IVector3 {
        return this._pos;
    }

    destroy(): void {
        this._instance.destroy();
    }

    isEntityInside(entity: AbstractVehicle<any> | AbstractCharacter<any>): boolean {
        return this._instance.isEntityIn(entity.instance);
    }
}
