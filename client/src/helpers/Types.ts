export type Point = {
    x: number,
    y: number
};

export type SerializedPath = {
    lineWidth: number,
    strokeStyle: string,
    points: Point[];
};