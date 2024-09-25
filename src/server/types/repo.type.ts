import type { IAccountCreateDto, IAccountDto } from '@/app/account/Account';
import type { IVehicleCreateCharacterOwnedDto, IVehicleDto } from '@shared/app/vehicle/VirtualVehicle';
import type { ICharacterDto } from '@shared/app/character/VirtualCharacter';
import type { ICharacterCreateRootDto } from '@/app/character/Character';

export interface IAccountRepository {
    getOrCreateAndGet(dto: IAccountCreateDto): Promise<IAccountDto>;
}

export interface ICharacterRepository {
    create(dto: ICharacterCreateRootDto): Promise<ICharacterDto>;
    findByAccountId(account_id: number): Promise<ICharacterDto[]>;
    findById(id: number): Promise<ICharacterDto | null>;
    addDollars(id: number, value: number): Promise<void>;
    isUsernameAvailable(username: string): Promise<boolean>;
}

export interface IVehicleRepository {
    createCharacterOwned(dto: IVehicleCreateCharacterOwnedDto): Promise<IVehicleDto>;
    getCharacterOwned(characterId: number): Promise<IVehicleDto[]>;
    isOwnedByCharacterId(character_id: number, vehicle_id: number): Promise<boolean>;
    findById(vehicle_id: number): Promise<IVehicleDto | null>;
}
