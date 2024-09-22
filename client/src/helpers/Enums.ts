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
    Small = "small",
    Medium = "medium",
    Large = "large"
}

export function getColorStrings(): string[] {
    return Object.keys(Color).filter((item) => {
        return isNaN(Number(item));
    });
}

export function convertColorToString(color: Color): string {
    return Color[color];
}

export function convertStringToColor(colorStr: string): Color {
    return Color[colorStr];
}