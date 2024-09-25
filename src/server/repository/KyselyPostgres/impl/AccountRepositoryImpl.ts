import { inject, injectable } from 'inversify';
import { $repository } from '@/_magic/inversify.tokens';
import type { IKysely } from '@/repository/KyselyPostgres/KyselyPostgresConnector';
import type { IAccountRepository } from '@/types/repo.type';
import type { IAccountCreateDto, IAccountDto } from '@/app/account/Account';

@injectable()
export class AccountRepositoryImpl implements IAccountRepository {
    @inject($repository._postgres)
    private readonly $!: IKysely;

    async getOrCreateAndGet(dto: IAccountCreateDto): Promise<IAccountDto> {
        return await this.$.transaction().execute(async (trx) => {
            const exists = await trx
                .selectFrom('accounts')
                .where('social_id', '=', dto.social_id)
                .selectAll()
                .executeTakeFirst();

            if (exists) return exists;

            return trx
                .insertInto('accounts')
                .values(() => {
                    return {
                        social_name: dto.social_name,
                        social_id: dto.social_id,
                    };
                })
                .returningAll()
                .executeTakeFirstOrThrow();
        });
    }
}
