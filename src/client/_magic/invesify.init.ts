import { Logger } from '@/app/builtin/Logger';
import { Render } from '@/app/builtin/Render';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import { Frontend } from '@/app/builtin/Frontend';
import { EventLogger } from '@/app/builtin/EventLogger';
import { AdminConsoleScript } from '@/app/admin_console/AdminConsole.script';
import { Server } from '@/app/builtin/Server';
import injector from '@/_magic/inversify.config';
import { VehicleService } from '@/app/vehicle/VehicleService';
import { ColshapeService } from '@/app/colspape/Colshape.service';
import { ColshapeObserver } from '@/app/colspape/Colshape.observer';
import { ColshapeStorage } from '@/app/colspape/Colshape.storage';
import { CharacterService } from '@/app/character/Character.service';
import { MapScript } from '@/app/map/Map.script';
import type { interfaces } from 'inversify';
import { createInjectedClassConstructorWrapper } from '@shared/utils/magic';
import { HudScript } from '@/app/hud/Hud.script';
import { Zone } from '@/app/zone/Zone';
import { PolygonCreator } from '@/app/polygon_creator/PolygonCreator';
import { ZoneEditorScript } from '@/app/zone/ZoneEditor.script';
import { ZoneScript } from '@/app/zone/Zone.script';
import { LoginScript } from '@/app/login/LoginScript';
import { CharacterCustomizationScript } from '@/app/character/CharacterCustomization.script';
import { CharacterSelectionScript } from '@/app/character/CharacterSelection.script';
import type { Character } from '@/app/character/Character';
import { $global } from '@/_magic/inversify.tokens';
import { RootService } from '@/app/Root.service';
import { NoClipScript } from '@/app/noclip/NoClip.script';
import { StreamCharacterService } from '@/app/character/StreamCharacter.service';
import { Stream } from '@/native/Stream';
import { CharacterInteractionScript } from '@/app/character_interaction/CharacterInteraction.script';
import { DebugScript } from '@/app/debug/Debug.script';
import { SpawnScript } from '@/app/spawn/Spawn.script';
import { CharacterCreationScript } from '@/app/character/CharacterCreation.script';

export const inversifyAfterWork = (data: { localCharacter: Character }): void => {
    injector.bind<NoClipScript>(NoClipScript).toSelf().inSingletonScope();
    injector.bind<VehicleService>(VehicleService).toSelf().inSingletonScope();
    injector.bind<ColshapeService>(ColshapeService).toSelf().inSingletonScope();
    injector.bind<ColshapeObserver>(ColshapeObserver).toSelf().inSingletonScope();
    injector.bind<ColshapeStorage>(ColshapeStorage).toSelf().inSingletonScope();
    injector.bind<CharacterService>(CharacterService).toSelf().inSingletonScope();
    injector.bind<MapScript>(MapScript).toSelf().inSingletonScope();
    injector.bind<HudScript>(HudScript).toSelf().inSingletonScope();
    injector.bind<ZoneEditorScript>(ZoneEditorScript).toSelf().inSingletonScope();
    injector.bind<ZoneScript>(ZoneScript).toSelf().inSingletonScope();
    injector.bind<PolygonCreator>(PolygonCreator).toSelf().inSingletonScope();
    injector.bind<AdminConsoleScript>(AdminConsoleScript).toSelf().inSingletonScope();
    injector.bind<RootService>(RootService).toSelf().inSingletonScope();
    injector.bind<StreamCharacterService>(StreamCharacterService).toSelf().inSingletonScope();
    injector.bind<Stream>(Stream).toSelf().inSingletonScope();
    injector.bind<CharacterInteractionScript>(CharacterInteractionScript).toSelf().inSingletonScope();
    injector.bind<DebugScript>(DebugScript).toSelf().inSingletonScope();
    injector.bind<SpawnScript>(SpawnScript).toSelf().inSingletonScope();
    injector.bind<Character>($global.localCharacter).toConstantValue(data.localCharacter);
};

export const inversifyInitialWork = (): void => {
    injector.bind($global.config).toConstantValue(globalThis.config);
    injector.bind<Logger>(Logger).toSelf().inSingletonScope();
    injector.bind<Render>(Render).toSelf().inSingletonScope();
    injector.bind<KeyResolver>(KeyResolver).toSelf().inSingletonScope();
    injector.bind<Frontend>(Frontend).toSelf().inSingletonScope();
    injector.bind<EventLogger>(EventLogger).toSelf().inSingletonScope();
    injector.bind<Server>(Server).toSelf().inSingletonScope();
    injector.bind<LoginScript>(LoginScript).toSelf().inSingletonScope();

    injector
        .bind<CharacterCreationScript>(CharacterCreationScript)
        .toDynamicValue((context: interfaces.Context): any =>
            createInjectedClassConstructorWrapper(CharacterCreationScript, context),
        );
    injector
        .bind<CharacterSelectionScript>(CharacterSelectionScript)
        .toDynamicValue((context: interfaces.Context): any =>
            createInjectedClassConstructorWrapper(CharacterSelectionScript, context),
        );
    injector
        .bind<CharacterCustomizationScript>(CharacterCustomizationScript)
        .toDynamicValue((context: interfaces.Context): any =>
            createInjectedClassConstructorWrapper(CharacterCustomizationScript, context),
        );
};
