import { AbstractEntity } from '../Entity';
import type { EFaction } from '../faction/Faction';
import type { ICharacterCustomization } from '../character_customization/AbstractCharacterCustomization';
import { AbstractCharacterCustomization } from '../character_customization/AbstractCharacterCustomization';

export class VirtualCharacter extends AbstractEntity<number> {
    protected declare _id: number;
    protected _username: string;
    protected _dollars: number;
    protected _faction: EFaction;

    protected _customization: AbstractCharacterCustomization | null = null;

    constructor(dto: ICharacterDto) {
        super(dto.id);
        this._username = dto.username;
        this._dollars = dto.dollars;
        this._faction = dto.faction;
        this._customization = new AbstractCharacterCustomization(dto.customization);
    }

    set customization(customization: AbstractCharacterCustomization) {
        this._customization = customization;
    }

    get customization(): AbstractCharacterCustomization | null {
        return this._customization;
    }

    get username(): string {
        return this._username;
    }

    set username(val: string) {
        this._username = val;
    }

    get dollars(): number {
        return this._dollars;
    }

    set dollars(val: number) {
        this._dollars = val;
    }

    get faction(): EFaction {
        return this._faction;
    }

    serialize(): ICharacterDto {
        return {
            id: this._id,
            username: this._username,
            dollars: this._dollars,
            faction: this._faction,
            customization: this._customization.serialize(),
        };
    }
}

export interface ICharacterDto {
    id: number;
    username: string;
    dollars: number;
    faction: EFaction;
    customization: ICharacterCustomization;
}

export interface ICharacterRootDto {
    id: number;
    username: string;
    dollars: number;
    faction: EFaction;
    customization: ICharacterCustomization;
}
