import { NativeWorldObject } from '../builtin/NativeWorldObject';
import type alt from 'alt-client';

export abstract class AbstractColshape extends NativeWorldObject<alt.Colshape> {
    protected declare readonly _instance: alt.Colshape;
    protected _debugMarker: alt.Marker | null = null;
    protected _debugTimer: number = -1;

    protected constructor() {
        super();
    }

    get instanceId(): number {
        return this._instance!.id;
    }

    get debugMarker(): alt.Marker | null {
        return this._debugMarker;
    }

    abstract destroy(): void;
    abstract debug(): void;
}
