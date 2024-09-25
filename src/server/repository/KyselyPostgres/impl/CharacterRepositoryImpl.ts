import { inject, injectable } from 'inversify';
import { $repository } from '@/_magic/inversify.tokens';

import type { IKysely } from '@/repository/KyselyPostgres/KyselyPostgresConnector';
import type { ICharacterRepository } from '@/types/repo.type';
import { sql } from 'kysely';
import type { ICharacterDto, ICharacterRootDto } from '@shared/app/character/VirtualCharacter';
import type { ICharacterCreateRootDto } from '@/app/character/Character';
import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import type { EFaction } from '@shared/app/faction/Faction';

@injectable()
export class CharacterRepositoryImpl implements ICharacterRepository {
    @inject($repository._postgres)
    private readonly $!: IKysely;

    async create(dto: ICharacterCreateRootDto): Promise<ICharacterRootDto> {
        const created_character = await this.$.insertInto('characters')
            .values(() => dto)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            id: created_character.id,
            dollars: created_character.dollars,
            ...dto,
        };
    }

    async findByAccountId(account_id: number): Promise<ICharacterDto[]> {
        const res = await this.$.selectFrom('characters').where('account_id', '=', account_id).selectAll().execute();
        return res.map((item) => {
            return {
                ...item,
                faction: item.faction as EFaction,
                customization: JSON.parse(item.customization) as ICharacterCustomization,
            };
        });
    }

    async findById(id: number): Promise<ICharacterDto | null> {
        const res = await this.$.selectFrom('characters').where('id', '=', id).selectAll().executeTakeFirst();
        if (!res) return null;

        return {
            ...res,
            faction: res.faction as EFaction,
            customization: JSON.parse(res.customization) as ICharacterCustomization,
        };
    }

    async addDollars(id: number, value: number): Promise<void> {
        await this.$.updateTable('characters')
            .set({
                dollars: (eb) => sql`${eb.ref('dollars')} + ${value}`,
            })
            .where('id', '=', id)
            .execute();
    }

    async isUsernameAvailable(username: string): Promise<boolean> {
        return !(await this.$.selectFrom('characters').where('username', '=', username).executeTakeFirst());
    }
}
