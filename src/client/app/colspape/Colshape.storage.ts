import { injectable } from 'inversify';
import type { AbstractColshape } from '@/app/colspape/AbstractColshape';

@injectable()
export class ColshapeStorage {
    private readonly _idToEntityList: Map<number /* native instance id */, AbstractColshape> = new Map();
    private readonly _entityToIdList: Map<AbstractColshape, number /* instance id */> = new Map();

    add(cs: AbstractColshape): void {
        this._idToEntityList.set(cs.instance.id, cs);
        this._entityToIdList.set(cs, cs.instance.id);
    }

    get(cs: AbstractColshape | number): AbstractColshape | null {
        if (typeof cs === 'number') {
            return this._idToEntityList.get(cs) ?? null;
        } else {
            const candidateCSId: number | void = this._entityToIdList.get(cs);
            if (!candidateCSId) return null;
            return this._idToEntityList.get(candidateCSId) ?? null;
        }
    }

    has(cs: AbstractColshape | number): boolean {
        if (typeof cs === 'number') {
            return this._idToEntityList.has(cs);
        } else {
            return this._entityToIdList.has(cs);
        }
    }

    delete(cs: AbstractColshape | number): void {
        if (typeof cs === 'number') {
            const candidateCS: AbstractColshape | void = this._idToEntityList.get(cs);
            if (!candidateCS) return;
            this._idToEntityList.delete(cs);
            this._entityToIdList.delete(candidateCS);
        } else {
            const candidateCSId: number | void = this._entityToIdList.get(cs);
            if (!candidateCSId) return;
            this._idToEntityList.delete(candidateCSId);
            this._entityToIdList.delete(cs);
        }
    }
}
