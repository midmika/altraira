import * as alt from 'alt-server';

import { inject, injectable } from 'inversify';
import { AccountService } from '@/app/account/Account.service';
import { CharacterService } from '@/app/character/Character.service';
import type { Character } from '@/app/character/Character';
import { CharacterStorage } from '@/app/character/Character.storage';
import { getEntityFromInstance } from '@/tools/getEntityFromInstance';
import type { IAnyEntity } from '@/types';

@injectable()
export class NativePlayerController {
    @inject(AccountService) private readonly accountService!: AccountService;
    @inject(CharacterService)
    private readonly characterService!: CharacterService;
    @inject(CharacterStorage)
    private readonly characterStorage!: CharacterStorage;

    start(): void {
        alt.on('playerConnect', this.onPlayerConnect.bind(this));
        alt.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
        alt.on('playerDeath', this.onPlayerDeath.bind(this));
        alt.on('playerSpawn', this.onPlayerSpawn.bind(this));
        alt.on('playerDamage', this.onPlayerDamage.bind(this));
    }

    private async onPlayerConnect(player: alt.Player): Promise<void> {
        try {
            await this.accountService.upsert(player.socialID, player.socialClubName);
            player.dimension = parseInt((Math.random() * 1e10).toFixed(0));
            player.spawn(129.32, -743.82, 253.19);
            player.rot = new alt.Vector3(0, 0, 1.48);
        } catch (error) {
            console.log(error);
        }
    }

    private async onPlayerDisconnect(player: alt.Player): Promise<void> {
        console.log('onPlayerDisconnect', player);
        const char: Character = player.$;
        if (char) {
            await this.characterService.onCharacterLeaveGame(char);
        }
    }

    private async onPlayerSpawn(player: alt.Player): Promise<void> {}

    private async onPlayerDeath(player: alt.Player, killer: alt.Entity | null, weaponHash: number): Promise<void> {
        if (!player.$) return;
        const killerEntity: IAnyEntity = getEntityFromInstance(killer);
        await this.characterService.onCharacterDeath(player.$, killerEntity, weaponHash);
    }

    private async onPlayerDamage(
        player: alt.Player,
        attacker: alt.Entity | null,
        healthDamage: number,
        armourDamage: number,
        weaponHash: number,
    ): Promise<void> {
        if (!player.$) return;
        const damageEntity: IAnyEntity = getEntityFromInstance(attacker);
        await this.characterService.onCharacterDamage(player.$, damageEntity, healthDamage, armourDamage, weaponHash);
    }
}
