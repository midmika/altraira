import { EFaction, type ICreationAllowedCustomization } from '../faction/Faction';

export const allowedCustomizationByFaction: Record<EFaction, ICreationAllowedCustomization> = {
    [EFaction.alt]: {
        model: ['mp_f_freemode_01'],
        hairs: {
            index: [15, 21, 40, 45, 50, 53],
            color1: [19, 29, 31, 32, 33, 34, 35, 36, 40],
            color2: [19, 29, 31, 32, 33, 34, 35, 36, 40],
        },
        facial: {
            eyeColor: [1, 7, 9, 11, 12, 15, 20, 21],
        },
    },
    [EFaction.skuf]: {
        model: ['mp_m_freemode_01'],
        hairs: {
            index: [0, 1, 5, 37, 41],
            color1: [0, 27],
            color2: [0, 27],
        },
        facial: {
            eyeColor: [0, 3, 5, 13],
        },
    },
    [EFaction.ryodan]: {
        model: ['mp_m_freemode_01'],
        hairs: {
            index: [15, 36, 51],
            color1: [0, 29],
            color2: [0],
        },
        facial: {
            eyeColor: [26],
        },
    },
};
