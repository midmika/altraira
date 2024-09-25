import { inject, injectable } from 'inversify';
import { $global } from '@/_magic/inversify.tokens';
import type { Character } from '@/app/character/Character';
import { StreamCharacterService } from '@/app/character/StreamCharacter.service';
import alt from 'alt-client';
import natives from 'natives';
import { drawText3d } from '@/utils/text';

@injectable()
export class CharacterInteractionScript {
    @inject($global.localCharacter)
    private readonly localCharacter: Character;

    @inject(StreamCharacterService)
    private readonly streamCharacterService: StreamCharacterService;

    private USERNAME_MAX_DISTANCE: number = 40;
    private USERNAME_MIN_FONT_SIZE = 0.1;
    private USERNAME_MAX_FONT_SIZE = 0.3;

    constructor() {}

    start(): void {
        alt.everyTick(() => {
            this.streamCharacterService.streamedCharacters.forEach((i) => this.renderCharacterUsername(i));
        });
    }

    private renderCharacterUsername(char: Character): void {
        if (!natives.hasEntityClearLosToEntity(this.localCharacter.instance, char.instance, 17)) return;
        const distance: number = char.distanceTo(this.localCharacter.pos);
        if (distance > 50) return;

        const fontSize =
            this.USERNAME_MAX_FONT_SIZE -
            (this.USERNAME_MAX_FONT_SIZE - this.USERNAME_MIN_FONT_SIZE) * (distance / this.USERNAME_MAX_DISTANCE);
        const alpha = 255 - 255 * (distance / this.USERNAME_MAX_DISTANCE);
        // const headPos: alt.Vector3 = natives.getPedBoneCoords(char.instance, 31086, 0, 0, 0);

        alt.log('font-size', Math.max(fontSize, this.USERNAME_MIN_FONT_SIZE), 'alpha:', alpha);

        const baseZOffset = 1;
        const distancePercent = (distance / this.USERNAME_MAX_DISTANCE) * 0.7;

        drawText3d(
            char.username,
            { x: char.instance.pos.x, y: char.instance.pos.y, z: char.instance.pos.z + baseZOffset + distancePercent },
            Math.max(fontSize, this.USERNAME_MIN_FONT_SIZE),
            0,
            [255, 255, 255, Math.max(alpha, 153)],
            true,
            true,
        );
    }
}
