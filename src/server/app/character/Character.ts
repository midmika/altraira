import { AbstractCharacter } from '@shared/app/character/AbstractCharacter';
import type { IApiResponse } from '@shared/api';
import type alt from 'alt-server';
import type { VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import type { EFaction } from '@shared/app/faction/Faction';
import type {
    AbstractCharacterCustomization,
    ICharacterCustomization,
} from '@shared/app/character_customization/AbstractCharacterCustomization';
import { CharacterCustomization } from '@/app/character/CharacterCustomization';

export class Character extends AbstractCharacter<alt.Player> {
    declare _instance: alt.Player;
    declare _customization: AbstractCharacterCustomization | null;

    constructor(virtualCharacter: VirtualCharacter, instance: alt.Player) {
        super(virtualCharacter, instance);
        this._customization = new CharacterCustomization(virtualCharacter.customization.serialize());
        this._instance.setStreamSyncedMeta('base', { id: this.id, username: this.username, faction: this.faction });
        this._instance.setStreamSyncedMeta('customization', this.customization?.serialize() || null);
    }

    call(event: string, ...args: any[]): void {
        try {
            this._instance?.emit(event, ...args);
        } catch (error) {
            console.log(`[Call] ${this._id} Unexpected error:`, error);
        }
    }

    set customization(customization: AbstractCharacterCustomization) {
        this._customization = customization;
        this._instance.setStreamSyncedMeta('_customization', customization.serialize());
    }

    get customization(): AbstractCharacterCustomization | null {
        return this._customization;
    }

    get dollars(): number {
        return this._dollars;
    }

    set dollars(val: number) {
        this._dollars = val;
        this.call('self:balance', this.dollars);
    }

    async fetch<T>(event: string, ...args: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            const requestStartTime: number = performance.now();

            const createRequestTimeString = (timestamp: number): string => {
                const clientResponseTime: number = timestamp - requestStartTime;
                const totalResponseTime: number = performance.now() - requestStartTime;
                return `(${clientResponseTime}ms, ${totalResponseTime}ms)`;
            };

            const onFail = (error: Error): void => {
                reject(error);
                console.log(`[Fetch] ${this._id} ${createRequestTimeString} (${event}) Unexpected error:`, error);
            };

            const onSuccess = (data: IApiResponse<T>): void => {
                if (data.error) {
                    reject(new Error(data.error));
                    console.log(
                        `[Fetch] ${this._id} ${createRequestTimeString(data.timestamp)} (${event}) failed.`,
                        data.error,
                    );
                } else {
                    resolve(data.data);
                    console.log(
                        `[Fetch] ${this._id} ${createRequestTimeString(data.timestamp)} (${event}) successfully.`,
                    );
                }
            };

            this._instance.emitRpc(event, args).then(onSuccess).catch(onFail);
        });
    }
}

export interface ICharacterCreateRootDto {
    account_id: number;
    username: string;
    faction: EFaction;
    customization: ICharacterCustomization;
}
