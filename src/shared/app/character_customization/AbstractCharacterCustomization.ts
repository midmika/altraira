import { deepAssign } from '../../utils/deepAssign';
import type { EFaction, ICreationAllowedCustomization } from '../faction/Faction';
import { allowedCustomizationByFaction } from './allowCustomizationByFaction';

const __default = {
    model: 'mp_m_freemode_01',
    parents: {
        mother: 0,
        father: 0,
        skinMix: 0,
        faceMix: 0,
    },
    hairs: {
        index: 0,
        color1: 0,
        color2: 0,
    },
    facial: {
        eyeColor: 0,
    },
};

export class AbstractCharacterCustomization {
    protected _customization: ICharacterCustomization;
    protected readonly _models = { male: 'mp_m_freemode_01', female: 'mp_f_freemode_01' };

    constructor(customization?: ICharacterCustomization) {
        if (!customization) customization = __default;
        this._customization = customization;
    }

    from(f: Partial<ICharacterCustomization>) {
        this._customization = deepAssign(this._customization, f);
        return this;
    }

    model(val: ICharacterModel) {
        this._customization.model = val;
        return this;
    }

    motherFace(val: number) {
        this._customization.parents.mother = val;
        return this;
    }

    fatherFace(val: number) {
        this._customization.parents.father = val;
        return this;
    }

    parentFacesMix(val: number) {
        this._customization.parents.faceMix = val;
        return this;
    }

    parentSkinMix(val: number) {
        this._customization.parents.skinMix = val;
        return this;
    }

    hairStyle(index: number) {
        this._customization.hairs.index = index;
        return this;
    }

    primaryHairColor(c: number) {
        this._customization.hairs.color1 = c;
        return this;
    }

    secondaryHairColor(c: number) {
        this._customization.hairs.color2 = c;
        return this;
    }

    eyeColor(index: number) {
        this._customization.facial.eyeColor = index;
        return this;
    }

    serialize(): ICharacterCustomization {
        return this._customization;
    }

    static isValidByFaction(
        faction: EFaction,
        obj: ICharacterCustomization,
        validValues?: ICreationAllowedCustomization,
    ): boolean {
        if (!validValues) validValues = allowedCustomizationByFaction[faction];

        for (const key in validValues) {
            if (!(key in obj)) {
                return false;
            }
        }

        // Проверка значений
        for (const key in validValues) {
            if (typeof validValues[key] === 'object' && typeof obj[key] === 'object') {
                if (!this.isValidByFaction(faction, obj[key], validValues[key])) {
                    return false;
                }
            } else if (Array.isArray(validValues[key])) {
                if (!validValues[key].includes(obj[key])) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }
}

interface ICharacterCustomizationParents {
    mother: number;
    father: number;
    skinMix: number;
    faceMix: number;
}

interface ICharacterCustomizationHairs {
    index: number;
    color1: number;
    color2: number;
}

export interface ICharacterCustomizationFacial {
    eyeColor: number;
}

export interface ICharacterCustomization {
    model: ICharacterModel;
    parents: ICharacterCustomizationParents;
    hairs: ICharacterCustomizationHairs;
    facial: ICharacterCustomizationFacial;
}

export type ICharacterModel = 'mp_m_freemode_01' | 'mp_f_freemode_01' | string;
