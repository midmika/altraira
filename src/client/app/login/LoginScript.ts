import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';
import injector from '@/_magic/inversify.config';
import { Server } from '@/app/builtin/Server';
import natives from 'natives';
import alt from 'alt-client';
import type { ICharacterDto } from '@shared/app/character/VirtualCharacter';
import { CharacterSelectionScript } from '@/app/character/CharacterSelection.script';
import { sleep } from '@/utils/sleep';
import { $global } from '@/_magic/inversify.tokens';
import type { IConfig } from '@/types';
import { CharacterCreationScript } from '@/app/character/CharacterCreation.script';

@injectable()
export class LoginScript {
    constructor(
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(Server) private readonly server: Server,
        @inject(CharacterCreationScript) private readonly creation: any,
        @inject(CharacterSelectionScript) private readonly selection: any,
        @inject($global.config) private readonly config: IConfig,
    ) {}

    async start(): Promise<ICharacterDto> {
        const disableTimer = alt.everyTick(() => {
            natives.disableAllControlActions(0);
            natives.disableAllControlActions(1);
            natives.disableAllControlActions(2);
            natives.disableControlAction(32, 200, true);
            natives.hideHudAndRadarThisFrame();
        });

        this.frontend.state = 'login';
        this.frontend.focus();

        const local = alt.Player.local;
        natives.setEntityAlpha(local, 0, true);

        const camera = natives.createCamera(alt.hash('DEFAULT_SCRIPTED_CAMERA'), true);

        natives.setCamCoord(camera, local.pos.x - 2, local.pos.y - 0.2, local.pos.z + 0.5);
        natives.setCamRot(camera, 0, 0, 0, 2);
        natives.setCamActive(camera, true);
        natives.setCamFov(camera, 70);
        natives.renderScriptCams(true, false, 0, true, false, 1);
        natives.pointCamAtEntity(camera, local, 0.0, 0.0, 0.0, true);
        alt.showCursor(true);

        const characters_list: ICharacterDto[] = await injector.get(Server).fetch('login:init');

        let selectedDto: ICharacterDto | null = null;
        let cleanupSelection: () => void = () => {};

        // if (this.config.skip_auth && characters_list.length) {
        //     selectedDto = characters_list[0];
        // } else {
            while (!selectedDto) {
                this.frontend.emit('login:phase', true);
                const selection: CharacterSelectionScript = this.selection();
                const selectionResult: { dto: ICharacterDto; cleanup: () => void } | null =
                    await selection.execute(characters_list);
                if (selectionResult) {
                    selectedDto = selectionResult.dto;
                    cleanupSelection = selectionResult.cleanup;
                } else {
                    this.frontend.emit('login:phase', false);
                    const creation: CharacterCreationScript = this.creation();
                    const creationResult: { dto: ICharacterDto; cleanup: () => void } | null = await creation.execute();
                    if (creationResult) {
                        selectedDto = creationResult.dto;
                        cleanupSelection = creationResult.cleanup;
                    }
                }
            }
        // }

        this.frontend.state = 'loading';

        await sleep(1500);

        cleanupSelection();
        alt.clearEveryTick(disableTimer);
        alt.showCursor(false);
        this.frontend.blur();
        natives.destroyCam(camera, true);
        natives.renderScriptCams(false, false, 0, true, false, 1);

        await this.server.fetch('login:start', selectedDto.id);

        return selectedDto;
    }
}
