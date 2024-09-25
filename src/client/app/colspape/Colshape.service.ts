import { inject, injectable } from 'inversify';
import type { AbstractColshape } from '@/app/colspape/AbstractColshape';
import type { IColshapeSubscriptionCallback } from '@/app/colspape/Colshape.observer';
import { ColshapeObserver } from '@/app/colspape/Colshape.observer';
import { ColshapeStorage } from '@/app/colspape/Colshape.storage';
import type { IAnyColshape } from '@shared/app/colshape/Colshape';
import type { ConstructorParameters, IAnyFunction } from '@shared/types';
import { PolygonColshape } from '@/app/colspape/PolygonColshape';
import alt from 'alt-client';

@injectable()
export class ColshapeService {
    @inject(ColshapeObserver)
    private readonly colshapeObserver!: ColshapeObserver;

    @inject(ColshapeStorage)
    private readonly colshapeStorage!: ColshapeStorage;

    private _list: IAnyColshape[] = [];

    private boundOnEnter = this.onEnter.bind(this);
    private boundOnLeave = this.onLeave.bind(this);

    start(): void {
        alt.on('entityEnterColshape', this.boundOnEnter);
        alt.on('entityLeaveColshape', this.boundOnLeave);
    }

    private _subscriptions: { [key: string]: Map<IAnyColshape, IAnyFunction[]> } = {
        enter: new Map(),
        leave: new Map(),
    };

    createPolygon(...args: ConstructorParameters<typeof PolygonColshape>): PolygonColshape {
        const cs = new PolygonColshape(...args);
        this._list.push(cs);
        return cs;
    }

    subscribe(colshape: AbstractColshape, cb: IColshapeSubscriptionCallback): void {
        this.colshapeObserver.subscribe(colshape, cb);
    }

    unsubscribe(colshape: AbstractColshape, cb: IColshapeSubscriptionCallback): void {
        this.colshapeObserver.unsubscribe(colshape, cb);
    }

    destroy(cs: AbstractColshape | number): void {
        this.colshapeStorage.delete(cs);
    }

    on(key: 'enter' | 'leave', cs: IAnyColshape, cb: IAnyFunction): void {
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

    delete(cs: IAnyColshape): void {
        this._list = this._list.filter((c) => c === cs);
    }

    private onEnter(nativeCs: alt.Colshape): void {
        this.trigger('enter', nativeCs);
    }

    private onLeave(nativeCs: alt.Colshape): void {
        this.trigger('leave', nativeCs);
    }

    private trigger(key: 'enter' | 'leave', nativeCs: alt.Colshape): void {
        const cs: IAnyColshape = nativeCs.$;
        if (!nativeCs.$) return;
        if (this._subscriptions[key].has(cs)) {
            this._subscriptions[key].get(cs)!.forEach((cb) => cb(cs));
        }
    }
}
