import { inject, injectable } from 'inversify';
import alt from 'alt-client';
import type { AbstractColshape } from '@/app/colspape/AbstractColshape';
import { ColshapeStorage } from '@/app/colspape/Colshape.storage';
import { Logger } from '@/app/builtin/Logger';

export type IColshapeSubscriptionCallback = (entity: alt.Entity, type: 'enter' | 'leave') => unknown | Promise<unknown>;

type SubscriptionArray = Array<IColshapeSubscriptionCallback>;

@injectable()
export class ColshapeObserver {
    @inject(ColshapeStorage)
    private readonly colshapeStorage!: ColshapeStorage;

    @inject(Logger)
    private readonly logger!: Logger;

    private readonly boundOnEntityEnterColshape = this.onEntityEnterColshape.bind(this);
    private readonly boundOnEntityLeaveColshape = this.onEntityLeaveColshape.bind(this);
    private subscriptions: Map<number /* Colshape Id */, SubscriptionArray> = new Map();

    constructor() {
        alt.on('entityEnterColshape', this.boundOnEntityEnterColshape);
        alt.on('entityLeaveColshape', this.boundOnEntityLeaveColshape);
    }

    subscribe(colshape: AbstractColshape, cb: IColshapeSubscriptionCallback): void {
        if (!this.subscriptions.has(colshape.instanceId)) this.subscriptions.set(colshape.instanceId, []);
        this.subscriptions.get(colshape.instanceId)!.push(cb);
    }

    unsubscribe(colshape: AbstractColshape, cb: IColshapeSubscriptionCallback): void {
        const callbacks: SubscriptionArray | undefined = this.subscriptions.get(colshape.instanceId);
        if (!callbacks) return;
        const index: number = callbacks.findIndex((item: IColshapeSubscriptionCallback) => item === cb);
        if (index !== -1) callbacks.splice(index, 1);
    }

    private onEntityEnterColshape(colshape: alt.Colshape, entity: alt.Entity): void {
        const target: AbstractColshape | null = this.colshapeStorage.get(colshape.id);
        if (!target) return;
        this.notifySubscribers(target, entity, 'enter');
    }

    private onEntityLeaveColshape(colshape: alt.Colshape, entity: alt.Entity): void {
        const target: AbstractColshape | null = this.colshapeStorage.get(colshape.id);
        if (!target) return;
        this.notifySubscribers(target, entity, 'leave');
    }

    private isSelf(entity: alt.Entity): boolean {
        return entity === alt.Player.local;
    }

    private notifySubscribers(colshape: AbstractColshape, entity: alt.Entity, type: 'enter' | 'leave'): void {
        const callbacks: SubscriptionArray | undefined = this.subscriptions.get(colshape.instanceId);
        if (callbacks) callbacks.forEach((cb) => cb(entity, type));
    }
}
