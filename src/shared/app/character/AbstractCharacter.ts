import { VirtualCharacter } from './VirtualCharacter';
import type alt_server from 'alt-server';
import type alt_client from 'alt-client';
import type { Vector3 } from '../NativeEntity';
import type { AbstractCharacterCustomization } from '../character_customization/AbstractCharacterCustomization';

export abstract class AbstractCharacter<T extends alt_server.Player | alt_client.Player> extends VirtualCharacter {
    protected declare _instance: T;
    protected declare _customization: AbstractCharacterCustomization;

    protected constructor(virtualCharacter: VirtualCharacter, instance: T) {
        super(virtualCharacter.serialize());
        this._instance = instance;
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
