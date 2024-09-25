import { inject, injectable } from 'inversify';
import alt from 'alt-client';
import { Character } from '@/app/character/Character';
import { VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import type { EFaction } from '@shared/app/faction/Faction';
import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import { CharacterService } from '@/app/character/Character.service';

@injectable()
export class StreamCharacterService {
    @inject(CharacterService)
    private readonly characterService: CharacterService;

    private readonly _idToInstance: Map<number, Character> = new Map();
    private readonly _entityToInstance: Map<alt.Player, Character> = new Map();

    addPlayer(player: alt.Player): void {
        if (player === alt.Player.local) return;
        this.addWithCheckInitialMeta(player);
    }

    removePlayer(player: alt.Player): void {
        if (player === alt.Player.local) return;
        const target = this._entityToInstance.get(player);
        if (!target) return;
        alt.log(`Character ${target.username}[${target.id}] removed from the stream`);
        this._idToInstance.delete(player.id);
        this._entityToInstance.delete(player);
    }

    updated(player: alt.Player, key: string, value: any, oldValue: string): void {
        if (player === alt.Player.local) return;
        if (this._entityToInstance.has(player)) {
            const target: Character = this._entityToInstance.get(player);
            switch (key) {
                case 'is_dead': {
                    this.characterService.onDeadToggle(target, value);
                }
            }
        } else {
            this.addWithCheckInitialMeta(player);
        }
    }

    isInStream(character: Character): boolean {
        return this._idToInstance.has(character.id);
    }

    private addWithCheckInitialMeta(player: alt.Player): void {
        const base: { id: number; username: string; faction: EFaction } = player.getStreamSyncedMeta('base') as {
            id: number;
            username: string;
            faction: EFaction;
        };
        if (!base) {
            alt.log(`Player ${player.id} stream in, but [base] meta is not defined`);
            return;
        }

        const customization: ICharacterCustomization = player.getStreamSyncedMeta(
            'customization',
        ) as ICharacterCustomization;
        if (!customization) {
            alt.log(`Player ${player.id} stream in, but [customization] meta is not defined`);
            return;
        }

        const virtual = new VirtualCharacter({ ...base, customization, dollars: -1 });
        const character = new Character(virtual, player);
        this._idToInstance.set(player.id, character);
        this._entityToInstance.set(player, character);

        alt.log(`Character ${character.username}[${character.id}] added to the stream`);
        // natives.setEntityAlpha(player, 255, false);
    }

    get streamedCharacters(): Character[] {
        return [...this._idToInstance.values()];
    }
}
