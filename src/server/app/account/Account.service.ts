import { inject, injectable } from 'inversify';
import { $repository } from '@/_magic/inversify.tokens';
import type { IAccountRepository } from '@/types/repo.type';
import type { IAccountDto } from '@/app/account/Account';
import { Account } from '@/app/account/Account';

@injectable()
export class AccountService {
    @inject($repository.accountRepository)
    private readonly accountRepository!: IAccountRepository;

    async upsert(social_id: string, social_name: string): Promise<Account> {
        const dto: IAccountDto = await this.accountRepository.getOrCreateAndGet({ social_id, social_name });
        return new Account(dto);
    }
}
