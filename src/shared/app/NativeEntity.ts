import type alt_server from 'alt-server';
import type alt_client from 'alt-client';
import { AbstractEntity } from './Entity';

export type Vector3 = alt_server.Vector3 | alt_client.Vector3;

export abstract class AbstractNativeEntity<
    T extends alt_server.Entity | alt_client.Entity,
    K,
> extends AbstractEntity<K> {
    protected readonly _instance: T;

    protected constructor(id: K) {
        super(id);
    }

    //#region Common
    get instance(): T {
        return this._instance;
    }

    get pos(): Vector3 {
        return this._instance.pos;
    }

    set pos(pos: Vector3) {
        this._instance.pos = pos;
    }

    get rot(): Vector3 {
        return this._instance.rot;
    }

    set rot(rot: Vector3) {
        this._instance.rot = rot;
    }

    get isValid(): boolean {
        return this._instance.valid;
    }

    get instanceId(): number {
        return this._instance.id;
    }

    distanceTo(pos: Vector3): number {
        return this._instance.pos.distanceTo(pos);
    }
    //#endregion
}
