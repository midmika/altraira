import { Controller, ControllerRpc, DontCheckCharacter } from '@shared/ControllerDecorators';
import type { IServerController } from '@shared/api';
import { inject, injectable } from 'inversify';
import { CharacterService } from '@/app/character/Character.service';
import type alt from 'alt-server';
import { AccountService } from '@/app/account/Account.service';
import type { Account } from '@/app/account/Account';
import type { ICharacterDto, VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import { EFaction } from '@shared/app/faction/Faction';
import { CharacterCustomization } from '@/app/character/CharacterCustomization';
import { Exception } from '@/error/Error';

@injectable()
@Controller('login')
export class LoginController implements IServerController<any> {
    @inject(AccountService)
    private readonly accountService!: AccountService;

    @inject(CharacterService)
    private readonly characterService!: CharacterService;

    @DontCheckCharacter()
    @ControllerRpc('init')
    async init(player: alt.Player): Promise<ICharacterDto[]> {
        const account: Account = await this.accountService.upsert(player.socialID, player.socialClubName);
        const characters: VirtualCharacter[] = await this.characterService.getAllVirtualByAccount(account);
        return characters.map((i) => i.serialize());
    }

    @DontCheckCharacter()
    @ControllerRpc('create')
    async create(
        player: alt.Player,
        username: string,
        faction: EFaction,
        customization: ICharacterCustomization,
    ): Promise<ICharacterDto> {
        const re = /^[a-zA-Z0-9]+$/;
        if (typeof username !== 'string' || username !== username.trim() || !re.test(username))
            throw new Exception('Недопустимые символы');
        const isAvailable: boolean = await this.characterService.isUsernameAvailable(username);
        if (!isAvailable) throw new Exception('Имя уже занято');
        if (!EFaction[faction]) throw new Exception('Неверная фракция');

        if (!CharacterCustomization.isValidByFaction(faction, customization)) {
            player.kick('Please relog');
            throw new Exception(`Неверная кастомизация`);
        }

        const account: Account = await this.accountService.upsert(player.socialID, player.socialClubName);
        if (!account) {
            player.kick('Please relog');
            throw new Exception(`Аккаунт не существует`);
        }

        return this.characterService.onRegister(account, username, faction, customization);
    }

    @DontCheckCharacter()
    @ControllerRpc('start')
    async start(player: alt.Player, characterId: number): Promise<void> {
        const account: Account = await this.accountService.upsert(player.socialID, player.socialClubName);
        const virtualCharactersList = await this.characterService.getAllVirtualByAccount(account);

        const target = virtualCharactersList.find((v) => v.id === characterId);
        if (!target) {
            player.kick('Account doesnt exists');
            return;
        }

        await this.characterService.onPlayerLogin(target, player);
    }

    @DontCheckCharacter()
    @ControllerRpc('spawn')
    async spawn(player: alt.Player): Promise<void> {
        if (!player.$) return;
        this.characterService.spawnToFactionSpawn(player.$);
    }
}
