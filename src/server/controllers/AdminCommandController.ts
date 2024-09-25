import { inject, injectable } from 'inversify';
import { Controller, ControllerEvent } from '@shared/ControllerDecorators';
import type { IApiAdminCommand, IServerController } from '@shared/api';

import type { Character } from '@/app/character/Character';
import { CharacterService } from '@/app/character/Character.service';
import alt from 'alt-server';

@injectable()
@Controller('acommand')
export class AdminCommandController implements IServerController<IApiAdminCommand> {
    @inject(CharacterService)
    private readonly characterService!: CharacterService;

    @ControllerEvent('veh')
    veh(char: Character, model: string, primaryColor?: number, secondaryColor?: number): void {
        new alt.Vehicle(model, char.instance.pos, char.instance.rot);
    }

    @ControllerEvent('money')
    money(char: Character, value: number): void {
        void this.characterService.addDollars(char, value);
    }
}
