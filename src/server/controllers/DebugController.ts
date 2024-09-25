import { Controller, ControllerEvent } from '@shared/ControllerDecorators';
import type { IServerController } from '@shared/api';
import { injectable } from 'inversify';
import type { Character } from '@/app/character/Character';
import alt from 'alt-server';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as fs from 'node:fs';
import type { IZoneDto } from '@shared/app/zone/AbstractZone';

@injectable()
@Controller('debug')
export class DebugController implements IServerController<any> {
    @ControllerEvent('polygon')
    async polygon(char: Character, id: string, text: any): Promise<void> {
        alt.log(id, text);
        const __dirname = fileURLToPath(import.meta.url);
        const debug_file = path.join(__dirname, '..', '..', '..', '..', '..', 'debug', id + '.txt');
        fs.writeFileSync(debug_file, JSON.stringify(text, null, 2));
    }

    @ControllerEvent('zone_editor_weapon')
    async zone_editor_weapon(char: Character, state: boolean): Promise<void> {
        if (state) {
            char.instance.giveWeapon('WEAPON_PISTOL', 1000, true);
        } else {
            char.instance.removeWeapon(alt.hash('WEAPON_PISTOL'));
        }
    }

    @ControllerEvent('update_zone_sources')
    async update_zone_sources(char: Character, list: IZoneDto[]): Promise<void> {
        const __dirname = fileURLToPath(import.meta.url);
        const zone_sources_path = path.join(__dirname, '..', '..', '..', '..', '..', 'src', 'sources', 'zones.json');
        fs.writeFileSync(zone_sources_path, JSON.stringify(list, null, 2));
    }
}
