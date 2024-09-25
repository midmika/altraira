import { AbstractCharacter } from '@shared/app/character/AbstractCharacter';
import type { VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import type alt from 'alt-client';
import { CharacterCustomizationScript } from '@/app/character/CharacterCustomization.script';

export class Character extends AbstractCharacter<alt.Player> {
    protected declare _customization: CharacterCustomizationScript;
    constructor(virtualCharacter: VirtualCharacter, instance: alt.Player) {
        super(virtualCharacter, instance);
        this._customization = new CharacterCustomizationScript(virtualCharacter.customization.serialize(), instance);
        this._customization.apply();
    }
}
