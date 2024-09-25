import {
    AbstractCharacterCustomization,
    type ICharacterCustomization,
} from '@shared/app/character_customization/AbstractCharacterCustomization';
import alt from 'alt-client';
import natives from 'natives';
import { femaleHairOverlays, maleHairOverlays } from '@shared/app/character_customization/const';

export class CharacterCustomizationScript extends AbstractCharacterCustomization {
    private readonly _ped: alt.Ped;
    protected declare _customization: ICharacterCustomization;
    protected declare _models: { male: string; female: string };

    constructor(dto: ICharacterCustomization | null, ped: alt.Ped) {
        super(dto);
        this._ped = ped;
    }

    apply() {
        alt.log('apply customization', this._ped.model, this._customization, alt.hash(this._customization.model));
        natives.setPedHeadBlendData(this._ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        // natives.setPlayerModel(this._ped as alt.LocalPlayer, alt.hash(this._customization.model));
        natives.clearPedDecorations(this._ped);

        // Parents
        natives.setPedHeadBlendData(
            this._ped,
            this._customization.parents.mother,
            this._customization.parents.father,
            0,
            this._customization.parents.mother,
            this._customization.parents.father,
            0,
            this._customization.parents.faceMix,
            this._customization.parents.skinMix,
            0,
            false,
        );

        //#region Hairs
        const overlays = this.isMale
            ? maleHairOverlays[this._customization.hairs.index]
            : femaleHairOverlays[this._customization.hairs.index];
        if (!overlays) throw new Error(`Cannot find overlay for hair style ${this._customization.hairs.index}`);
        const collection_hash = natives.getHashKey(overlays.collection);
        const overlay_hash = natives.getHashKey(overlays.overlay);
        natives.addPedDecorationFromHashes(this._ped, collection_hash, overlay_hash);
        natives.setPedComponentVariation(this._ped, 2, this._customization.hairs.index, 0, 0);
        natives.setPedHairTint(this._ped, this._customization.hairs.color1, this._customization.hairs.color2);
        //#endregion

        //#region Facial
        natives.setHeadBlendEyeColor(this._ped, this._customization.facial.eyeColor);
        //#endregion

        // // Body
        // natives.setPedComponentVariation(alt.Player.local.scriptID, 3, 37, 0, 0); // arms
        // natives.setPedComponentVariation(alt.Player.local.scriptID, 4, 133, 2, 0); // pants
        // natives.setPedComponentVariation(alt.Player.local.scriptID, 6, 18, 1, 0); // shoes
        // natives.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
        // natives.setPedComponentVariation(alt.Player.local.scriptID, 11, 101, 0, 0); // torso
    }

    get isMale(): boolean {
        return this._ped.model === alt.hash('mp_m_freemode_01');
    }
}
