import { inject, injectable } from 'inversify';
import { $global } from '@/_magic/inversify.tokens';
import { Frontend } from '@/app/builtin/Frontend';
import type { Character } from '@/app/character/Character';
import natives from 'natives';

@injectable()
export class CharacterService {
    @inject($global.localCharacter) private readonly char!: Character;
    @inject(Frontend) private readonly frontend!: Frontend;

    onDeadToggle(character: Character, val: boolean): void {
        natives.setPedToRagdoll(character.instance, 100000, 1000000, 0, false, false, false);
    }
}
