import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import { AbstractCharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';

export class CharacterCustomization extends AbstractCharacterCustomization {
    constructor(dto: ICharacterCustomization) {
        super(dto);
    }
}
