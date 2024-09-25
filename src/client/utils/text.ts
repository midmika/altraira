import type { IVector2, IVector3, RGBA } from 'alt-shared';
import native from 'natives';
import type { IRGBA } from '@shared/types';

export function drawText3d(
    msg: string,
    pos: IVector3,
    scale: number,
    fontType: number,
    color: IRGBA,
    useOutline = true,
    useDropShadow = true,
) {
    native.setDrawOrigin(pos.x, pos.y, pos.z, false);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(...color);

    if (useOutline) native.setTextOutline();
    if (useDropShadow) native.setTextDropShadow();

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}

export function drawText2d(
    msg: string,
    pos: IVector2,
    scale: number,
    fontType: number,
    color: IRGBA,
    useOutline = true,
    useDropShadow = true,
    align = 0,
) {
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(...color);
    native.setTextJustification(align);

    if (useOutline) native.setTextOutline();

    if (useDropShadow) native.setTextDropShadow();

    native.endTextCommandDisplayText(pos.x, pos.y, 1);
}
