import { AccountService } from '@/app/account/Account.service';
import { CharacterService } from '@/app/character/Character.service';
import { AccountRepositoryImpl } from '@/repository/KyselyPostgres/impl/AccountRepositoryImpl';
import { CharacterRepositoryImpl } from '@/repository/KyselyPostgres/impl/CharacterRepositoryImpl';
import type { IKysely } from '@/repository/KyselyPostgres/KyselyPostgresConnector';
import { KyselyPostgresConnector } from '@/repository/KyselyPostgres/KyselyPostgresConnector';
import injector from '@/_magic/inversify.config';
import { $repository } from '@/_magic/inversify.tokens';
import type { IAccountRepository, ICharacterRepository } from '@/types/repo.type';

import { NativePlayerController } from '@/native/NativePlayerController';
import { NativeVehicleController } from '@/native/NativeVehicleController';
import type { interfaces } from 'inversify';
import { createInjectedClassConstructorWrapper } from '@shared/utils/magic';
import { CharacterStorage } from '@/app/character/Character.storage';
import { Zone } from '@/app/zone/Zone';
import { ZoneScript } from '@/app/zone/Zone.script';
import { ColshapeScript } from '@/app/colshape/Colshape.script';
import { SpawnScript } from '@/app/spawn/Spawn.script';
import { RootService } from '@/app/Root.service';
import { DevScript } from '@/app/dev/Dev.script';
import { Logger } from '@/app/logger/Logger.service';

const inversifyInit = async (): Promise<void> => {

    // region Connect Database
    injector.bind<IKysely>($repository._postgres).toConstantValue(KyselyPostgresConnector());
    // endregion

    // Repositories
    injector.bind<IAccountRepository>($repository.accountRepository).to(AccountRepositoryImpl).inSingletonScope();
    injector.bind<ICharacterRepository>($repository.characterRepository).to(CharacterRepositoryImpl).inSingletonScope();

    // Services
    injector.bind<AccountService>(AccountService).toSelf().inSingletonScope();
    injector.bind<CharacterService>(CharacterService).toSelf().inSingletonScope();

    injector.bind<CharacterStorage>(CharacterStorage).toSelf().inSingletonScope();

    injector.bind(NativePlayerController).toSelf().inSingletonScope();
    injector.bind(NativeVehicleController).toSelf().inSingletonScope();

    injector.bind(ColshapeScript).toSelf().inSingletonScope();

    injector
        .bind<Zone>(Zone)
        .toDynamicValue((context: interfaces.Context): any => createInjectedClassConstructorWrapper(Zone, context));
    injector.bind(ZoneScript).toSelf().inSingletonScope();
    injector.bind(SpawnScript).toSelf().inSingletonScope();
    injector.bind(RootService).toSelf().inSingletonScope();

    // Only in dev mode!
    injector.bind(DevScript).toSelf().inSingletonScope();

    injector.bind(Logger).toSelf().inSingletonScope();
};

export default inversifyInit;
