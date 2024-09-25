import { injectable } from 'inversify';
import { PolygonColshape } from '@/app/colshape/PolygonColshape';
import type { ConstructorParameters, IAnyFunction } from '@shared/types';
import alt from 'alt-server';
import type { IAnyColshape } from '@shared/app/colshape/Colshape';
import { getEntityFromInstance } from '@/tools/getEntityFromInstance';
import type { IAnyEntity } from '@/types';
import { SphereColshape } from '@/app/colshape/SphereColshape';

type ICallback = (instance: IAnyEntity) => any;

@injectable()
export class ColshapeScript {
    private _list: IAnyColshape[] = [];

    private boundOnEnter = this.onEnter.bind(this);
    private boundOnLeave = this.onLeave.bind(this);

    private _subscriptions: { [key: string]: Map<IAnyColshape, ICallback[]> } = {
        enter: new Map(),
        leave: new Map(),
    };

    start(): void {
        alt.on('entityEnterColshape', this.boundOnEnter);
        alt.on('entityLeaveColshape', this.boundOnLeave);
    }

    on(key: 'enter' | 'leave', cs: IAnyColshape, cb: ICallback): void {
        if (!this._subscriptions[key].has(cs)) {
            this._subscriptions[key].set(cs, []);
        }
        this._subscriptions[key].get(cs)!.push(cb);
    }

    off(key: 'enter' | 'leave', cs: IAnyColshape, cb?: IAnyFunction) {
        if (this._subscriptions[key].has(cs)) {
            if (cb) {
                const callbacks = this._subscriptions[key].get(cs)!;
                const index = callbacks.indexOf(cb);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                }
            } else {
                this._subscriptions[key].delete(cs);
            }
        }
    }

    createPolygon(...args: ConstructorParameters<typeof PolygonColshape>): PolygonColshape {
        const cs = new PolygonColshape(...args);
        this._list.push(cs);
        return cs;
    }

    createSphere(...args: ConstructorParameters<typeof SphereColshape>): SphereColshape {
        const cs = new SphereColshape(...args);
        this._list.push(cs);
        return cs;
    }

    delete(cs: IAnyColshape): void {
        this._list = this._list.filter((c) => c === cs);
    }

    private onEnter(nativeCs: alt.Colshape, nativeEntity: alt.Entity): void {
        this.trigger('enter', nativeCs, nativeEntity);
    }

    private onLeave(nativeCs: alt.Colshape, nativeEntity: alt.Entity): void {
        this.trigger('leave', nativeCs, nativeEntity);
    }

    private trigger(key: 'enter' | 'leave', nativeCs: alt.Colshape, nativeEntity: alt.Entity): void {
        const cs: IAnyColshape = nativeCs.$;
        if (!nativeCs.$ || !('$' in nativeEntity)) return;
        const instance: IAnyEntity = getEntityFromInstance(nativeEntity);
        if (!instance) return;
        if (this._subscriptions[key].has(cs)) {
            this._subscriptions[key].get(cs)!.forEach((cb) => cb(instance));
        }
    }
}
