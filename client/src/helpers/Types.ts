export type Point = {
    x: number,
    y: number
};

export type StrPoint = {
    x: string,
    y: string,
};

export type SerializedPath = {
    lineWidth: number,
    strokeStyle: string,
    points: Point[];
};

export type UUIDandSerializedPath = {
    uuid: any;
    serializedPath: SerializedPath;
}