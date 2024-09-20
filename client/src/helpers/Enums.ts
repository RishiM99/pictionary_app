export enum PaletteOption {
    Pen,
    ColorPicker,
    Eraser
}

export enum Color {
    Black,
    Gray,
    Purple,
    Blue,
    Teal,
    Green,
    Yellow,
    Orange,
    Brown,
    Red
}

export enum StrokeSize {
    Small = "small",
    Medium = "medium",
    Large = "large"
}

export function getColorValues(): string[] {
    return Object.keys(Color).filter((item) => {
        return isNaN(Number(item));
    }).map((x) => x.toLowerCase());
}