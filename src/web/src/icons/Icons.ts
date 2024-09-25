export type IIconColor = 'white';
export type IIconCursor = 'initial' | 'pointer';
export type IIconSize = 'small' | 'medium' | 'large';

export interface IIconsProps {
    color?: IIconColor;
    cursor?: IIconCursor;
    size?: IIconSize;
}

export const iconColorize = (color: IIconColor): string => {
    switch (color) {
        case 'white':
            return '#fff';
    }
};
