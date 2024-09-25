import type { IVector3 } from 'alt-shared';
import type { ICylinderColshapeDto } from '@/app/core/colshape/CylinderColshape';
import type { IParkingZoneDto } from '@/app/parking/AbstractParkingZone';

export abstract class AbstractGate {
    protected readonly _name: string;
    protected readonly _hash: string;
    protected readonly _type: EGateType;
    protected readonly _pos: IVector3;
    protected _loadColshapeDto: ICylinderColshapeDto;

    protected _buyPrice: number | null = null;
    protected _sellPrice: number | null = null;

    protected constructor(dto: IGateSource) {
        this._name = dto.name;
        this._hash = dto.hash
        this._type = dto.type;
        this._pos = dto.pos;
        this._loadColshapeDto = dto.loadColshape
    }

    get loadColshapeDto(): ICylinderColshapeDto {
        return this._loadColshapeDto
    }

    get hash(): string {
        return this._hash;
    }

    get name(): string {
        return this._name;
    }

    get type(): EGateType {
        return this._type;
    }

    get pos(): IVector3 {
        return this._pos;
    }

    get sellPrice(): number | null{
        return this._sellPrice;
    }

    get buyPrice(): number | null {
        return this._buyPrice;
    }
}

export enum EGateType {
    goods,
    fuel,
    dock,
}

export interface IGateSource {
    name: string;
    hash: string;
    type: EGateType;
    pos: IVector3;
    loadColshape: ICylinderColshapeDto,
    trailerSpawnList: Array<IParkingZoneDto>
}

export interface IGateDto extends IGateSource {
    buyPrice: number | null;
    sellPrice: number | null;
}

export interface IGateClientDto extends IGateDto {}

export interface IGateFrontend extends Omit<IGateClientDto, 'loadColshape' | 'trailerSpawnList'> {
    buyPrice: number | null;
    sellPrice: number | null;
}
