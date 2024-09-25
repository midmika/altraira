import type { IVector3 } from 'alt-shared';
import type alt from 'alt-client';

export abstract class NativeWorldObject<T extends alt.WorldObject> {
    protected declare readonly _instance: T;

    equals(nativeWorldObject: NativeWorldObject<T>): boolean {
        return nativeWorldObject === this;
    }

    destroy(): void {
        this._instance?.destroy();
    }

    get isSpawned(): boolean {
        return this.instance?.valid ?? false;
    }

    get instance(): T {
        return this._instance;
    }

    get pos(): IVector3 {
        this.validateInstanceUnSafe();
        return this._instance!.pos;
    }

    distanceTo(pos: IVector3): number {
        this.validateInstanceUnSafe();
        return this._instance?.pos.distanceTo(pos) || Infinity;
    }

    private validateInstanceUnSafe(): void | never {
        if (!this._instance) {
            throw new Error(`Entity instance is not assigned to instance`);
        } else if (!this._instance.valid) {
            throw new Error(`Entity #${this._instance.id} isn't spawned!`);
        }
    }
}
