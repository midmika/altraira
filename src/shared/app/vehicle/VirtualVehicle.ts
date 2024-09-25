import { AbstractCharacter } from '../character/AbstractCharacter';
import { AbstractEntity } from '../Entity';
import { EVehicleOwnerType } from '../../types/core/vehicle';
import type alt_server from 'alt-server';
import type alt_client from 'alt-client';

export class VirtualVehicle extends AbstractEntity<number> {
    protected declare readonly _id: number;

    protected readonly _modelName: string;
    protected readonly _type: EVehicleType = EVehicleType.normal;

    protected _ownerType: EVehicleOwnerType;
    protected _ownerCharacterId: number | null = null;
    protected _primaryColor: number;
    protected _secondaryColor: number;
    protected _numberPlateText: string;
    protected _numberPlateIndex: number;

    constructor(dto: IVehicleDto) {
        super(dto.id);
        this._modelName = dto.modelName;
        this._ownerType = dto.ownerType;
        this._ownerCharacterId = dto.ownerCharacterId ?? null;
        this._primaryColor = dto.primaryColor ?? 0;
        this._secondaryColor = dto.secondaryColor ?? 0;
        this._numberPlateText = dto.numberPlateText ?? '';
        this._numberPlateIndex = dto.numberPlateIndex ?? 1;

        if (dto.modelName in ETruckModel) {
            this._type = EVehicleType.truck;
        } else {
            this._type = EVehicleType.normal;
        }
    }

    public isOwnedByCharacter(candidate?: AbstractCharacter<alt_client.Player | alt_server.Player>): boolean {
        if (this._ownerType !== EVehicleOwnerType.char) return false;
        if (candidate instanceof AbstractCharacter) {
            return candidate.id === this._ownerCharacterId;
        }
        return !!this._ownerCharacterId;
    }

    get isTruck(): boolean {
        return this._type === EVehicleType.truck;
    }

    get isTrailer(): boolean {
        return this._type === EVehicleType.trailer;
    }

    get model(): string {
        return this._modelName;
    }

    get type(): EVehicleType {
        return this._type;
    }

    get ownerType(): EVehicleOwnerType {
        return this._ownerType;
    }

    get primaryColor(): number {
        return this._primaryColor;
    }

    get secondaryColor(): number {
        return this._secondaryColor;
    }

    get numberPlateIndex(): number {
        return this._numberPlateIndex;
    }

    get numberPlateText(): string {
        return this._numberPlateText;
    }

    serialize(): IVehicleDto {
        return {
            id: this._id,
            modelName: this._modelName,
            ownerType: this._ownerType,
            primaryColor: this._primaryColor,
            secondaryColor: this._secondaryColor,
            numberPlateText: this._numberPlateText,
            numberPlateIndex: this._numberPlateIndex,
            ownerCharacterId: this._ownerCharacterId,
        };
    }
}

export interface IVehicleDto {
    id: number;
    modelName: string;
    ownerCharacterId: number | null;
    ownerType: EVehicleOwnerType;
    primaryColor: number;
    secondaryColor: number;
    numberPlateText: string;
    numberPlateIndex: number;
}

export interface IVehicleCreateCharacterOwnedDto extends Omit<IVehicleDto, 'id'> {}

export enum EVehicleType {
    normal = 'normal',
    truck = 'truck',
    trailer = 'trailer',
}

export enum ETruckModel {
    hauler = 'hauler',
    hauler2 = 'hauler2',
    phantom = 'phantom',
    phantom3 = 'phantom3',
}

export enum ETrailerModel {
    trailers = 'trailers',
    trailers2 = 'trailers2',
    trailers3 = 'trailers3',
    trailers4 = 'trailers4',
    tvtrailer = 'tvtrailer',
    tvtrailer2 = 'tvtrailer2',
    tanker = 'tanker',
    tanker2 = 'tanker2',
    armytanker = 'armytanker',
    trailerlogs = 'trailerlogs',
    docktrailer = 'docktrailer',
    trflat = 'trflat',
    armytrailer = 'armytrailer',
    tr2 = 'tr2',
    tr4 = 'tr4',
}

export enum ETrailerType {
    covered,
    container,
    tanker,
    open,
    vehicle,
}

export const trailerModelToTypeMap: Record<ETrailerModel, ETrailerType> = {
    trailers: ETrailerType.covered,
    trailers2: ETrailerType.covered,
    trailers3: ETrailerType.covered,
    trailers4: ETrailerType.covered,
    tvtrailer: ETrailerType.covered,
    tvtrailer2: ETrailerType.covered,
    tanker: ETrailerType.tanker,
    tanker2: ETrailerType.tanker,
    armytanker: ETrailerType.tanker,
    trailerlogs: ETrailerType.open,
    trflat: ETrailerType.open,
    armytrailer: ETrailerType.open,
    tr2: ETrailerType.vehicle,
    tr4: ETrailerType.vehicle,
    docktrailer: ETrailerType.container,
};
