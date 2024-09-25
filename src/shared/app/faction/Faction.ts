import type { ICharacterModel } from '../character_customization/AbstractCharacterCustomization';

export enum EFaction {
    skuf = 'skuf',
    alt = 'alt',
    ryodan = 'ryodan',
}

export interface ICreationAllowedCustomization {
    model: ICharacterModel[];
    hairs: {
        index: number[];
        color1: number[];
        color2: number[];
    };
    facial: {
        eyeColor: number[];
    };
}

export const FactionNames: Record<EFaction, string> = {
    [EFaction.alt]: 'Альтушки',
    [EFaction.ryodan]: 'ЧВК "Редан"',
    [EFaction.skuf]: 'Скуфы"',
};

export const FactionColor: Record<EFaction, [number, number, number]> = {
    [EFaction.alt]: [255, 0, 0],
    [EFaction.ryodan]: [0, 255, 0],
    [EFaction.skuf]: [0, 0, 255],
};
