export enum PaletteOption {
    Pen,
    ColorPicker,
    Eraser
}

export enum Color {
    black,
    gray,
    purple,
    blue,
    teal,
    green,
    yellow,
    orange,
    brown,
    red
}

export enum StrokeSize {
    small,
    medium,
    large
}

export function getColorStrings(): string[] {
    return Object.keys(Color).filter((item) => {
        return isNaN(Number(item));
    });
}

export function getStrokeSizeStrings(): string[] {
    return Object.keys(StrokeSize).filter((item) => {
        return isNaN(Number(item));
    });
}

export function convertColorToString(color: Color): string {
    return Color[color];
}

export function convertStrokeSizeToString(strokeSize: StrokeSize): string {
    return StrokeSize[strokeSize];
}

export function convertStringToColor(colorStr: string): Color {
    return Color[colorStr];
}

export function convertStringToStrokeSize(strokeSizeStr: string): StrokeSize {
    return StrokeSize[strokeSizeStr];
}