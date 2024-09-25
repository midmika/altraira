import { Controller, ControllerEvent } from '@shared/ControllerDecorators';
import { inject, injectable } from 'inversify';
import { CharacterService } from '@/app/character/Character.service';
import { HudScript } from '@/app/hud/Hud.script';

@injectable()
@Controller('self')
export class SelfController {
    @inject(HudScript) private readonly hudScript!: HudScript;
    @inject(CharacterService) private readonly localCharacterService!: CharacterService;

    @ControllerEvent('balance')
    async balance(newBalance: number): Promise<void> {
        this.localCharacterService.setDollars(newBalance);
        this.hudScript.dollars = newBalance;
    }
}
