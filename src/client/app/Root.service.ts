import { inject, injectable } from 'inversify';
import { HudScript } from '@/app/hud/Hud.script';
import { ZoneScript } from '@/app/zone/Zone.script';
import { AdminConsoleScript } from '@/app/admin_console/AdminConsole.script';
import { MapScript } from '@/app/map/Map.script';
import { ColshapeService } from '@/app/colspape/Colshape.service';
import { Frontend } from '@/app/builtin/Frontend';
import natives from 'natives';
import * as alt from 'alt-client';
import { $global } from '@/_magic/inversify.tokens';
import type { Character } from '@/app/character/Character';
import { Server } from '@/app/builtin/Server';
import { NoClipScript } from '@/app/noclip/NoClip.script';
import { Stream } from '@/native/Stream';
import { CharacterInteractionScript } from '@/app/character_interaction/CharacterInteraction.script';
import { DebugScript } from '@/app/debug/Debug.script';
import { ZoneEditorScript } from '@/app/zone/ZoneEditor.script';
import { SpawnScript } from '@/app/spawn/Spawn.script';

@injectable()
export class RootService {
    @inject(HudScript)
    private readonly hudScript: HudScript;

    @inject(ZoneScript)
    private readonly zoneService: ZoneScript;

    @inject(AdminConsoleScript)
    private readonly adminConsoleScript: AdminConsoleScript;

    @inject(MapScript)
    private readonly mapScript: MapScript;

    @inject(ColshapeService)
    private readonly colshapeService: ColshapeService;

    @inject(Frontend)
    private readonly frontend: Frontend;

    @inject(Server)
    private readonly server: Server;

    @inject(NoClipScript)
    private readonly noClipScript: NoClipScript;

    @inject(Stream)
    private readonly stream: Stream;

    @inject(CharacterInteractionScript)
    private readonly characterInteractionScript: CharacterInteractionScript;

    @inject(DebugScript)
    private readonly debugScript: DebugScript;

    @inject(SpawnScript)
    private readonly spawnScript: SpawnScript;

    @inject($global.localCharacter)
    private readonly localCharacter: Character;

    async initialize(): Promise<void> {
        this.adminConsoleScript.start();
        this.noClipScript.start();
        this.hudScript.start();

        this.mapScript.start();
        this.stream.start();
        this.characterInteractionScript.start();
        this.colshapeService.start();

        this.zoneService.start();
        this.spawnScript.start();

        this.debugScript.start();

        this.server.listen();
        natives.setEntityAlpha(this.localCharacter.instance, 255, false);

        await this.server.fetch('login:spawn');
        this.frontend.state = 'hud';
    }
}
