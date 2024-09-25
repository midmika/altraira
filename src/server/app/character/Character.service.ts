import { inject, injectable } from 'inversify';
import { $repository } from '@/_magic/inversify.tokens';
import * as alt from 'alt-server';
import type { ICharacterRepository } from '@/types/repo.type';
import type { ICharacterCreateRootDto } from '@/app/character/Character';
import { Character } from '@/app/character/Character';
import type { ICharacterDto } from '@shared/app/character/VirtualCharacter';
import { VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import { CharacterStorage } from '@/app/character/Character.storage';
import type { Account } from '@/app/account/Account';
import { CharacterCustomization } from '@/app/character/CharacterCustomization';
import type { EFaction } from '@shared/app/faction/Faction';
import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import { EWeaponModel } from '@shared/weapon.enum';
import { SpawnScript } from '@/app/spawn/Spawn.script';
import type { Spawn } from '@/app/spawn/Spawn';
import { Logger } from '@/app/logger/Logger.service';

@injectable()
export class CharacterService {
    @inject($repository.characterRepository)
    private readonly characterRepository!: ICharacterRepository;

    @inject(CharacterStorage)
    private readonly characterStorage!: CharacterStorage;

    @inject(SpawnScript)
    private readonly spawnScript!: SpawnScript;

    @inject(Logger)
    private readonly logger!: Logger;

    async onPlayerLogin(virtualCharacter: VirtualCharacter, player: alt.Player): Promise<void> {
        const character: Character = new Character(virtualCharacter, player);
        character.customization = new CharacterCustomization(virtualCharacter.customization!.serialize());
        character.instance.model = character.customization.serialize().model;
        player.$ = character;

        alt.log('Player', character.instance!.name, 'join us');
        this.logger.plain('Login', { characterId: character.id });

        player.giveWeapon(EWeaponModel.ASSAULTRIFLE, 1000, true);
        this.characterStorage.add(character);

        if (process.env.ALTAIRA_MODE === 'dev' && process.env.ALTAIRA_DEV_OVERWRITE_SPAWN) {
            const [x, y, z] = process.env.ALTAIRA_DEV_OVERWRITE_SPAWN.split(' ').map((i) => parseFloat(i));
            player.spawn(x, y, z);
        } else {
            this.spawnToFactionSpawn(character);
        }
        player.dimension = 0;
    }

    async onRegister(
        account: Account,
        username: string,
        faction: EFaction,
        customization: ICharacterCustomization,
    ): Promise<ICharacterDto> {
        return await this.characterRepository.create({ account_id: account.id, faction, customization, username });
    }

    async onCharacterLeaveGame(character: Character): Promise<void> {
        alt.log('Player', character.instance.name, 'leave us');
        this.characterStorage.delete(character);
    }

    async create(createDto: ICharacterCreateRootDto): Promise<VirtualCharacter> {
        const dto: ICharacterDto | null = await this.characterRepository.create(createDto);
        if (!dto) throw new Error('Cannot create character');
        return new VirtualCharacter(dto);
    }

    async onCharacterDamage(
        character: Character,
        attacker: Character | null,
        healthDamage: number,
        armourDamage: number,
        weaponHash: number,
    ): Promise<void> {
        alt.log(`Character #${character.id} damaged by [${attacker}] ${healthDamage} ${armourDamage} [${weaponHash}]`);
    }

    async onCharacterDeath(character: Character, killer: Character | null, weaponHash: number): Promise<void> {
        character.instance.invincible = true;
        character.instance.setStreamSyncedMeta('is_dead', true);

        alt.log(`Character #${character.id} death from ${killer} [${weaponHash}]`);

        setTimeout(() => {
            character.instance.setStreamSyncedMeta('is_dead', false);
            if (process.env.ALTAIRA_MODE === 'dev' && process.env.ALTAIRA_DEV_OVERWRITE_SPAWN) {
                const [x, y, z] = process.env.ALTAIRA_DEV_OVERWRITE_SPAWN.split(' ').map((i) => parseFloat(i));
                character.instance.spawn(x, y, z);
            } else {
                this.spawnToFactionSpawn(character);
            }
            character.instance.clearBloodDamage();
            character.instance.maxHealth = 200;
            character.instance.health = 200;
            character.instance.invincible = false;
        }, 5000);
    }

    async addDollars(virtualCharacter: VirtualCharacter, value: number): Promise<void> {
        await this.characterRepository.addDollars(virtualCharacter.id, value);
        const char: Character | null = this.getCharacterByVirtual(virtualCharacter);

        if (char) {
            char.dollars += value;
        } else {
            virtualCharacter.dollars += value;
        }
    }

    getCharacterByVirtual(virtualCharacter: VirtualCharacter): Character | null {
        return this.characterStorage.getById(virtualCharacter.id);
    }

    async getAllVirtualByAccount(account: Account): Promise<VirtualCharacter[]> {
        return (await this.characterRepository.findByAccountId(account.id)).map((dto) => new VirtualCharacter(dto));
    }

    async isUsernameAvailable(username: string): Promise<boolean> {
        return this.characterRepository.isUsernameAvailable(username);
    }

    spawnToFactionSpawn(char: Character): void {
        const spawn: Spawn = this.spawnScript.getByFaction(char.faction);
        spawn.to(char);
    }
}
