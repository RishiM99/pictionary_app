export type Point = {
    x: number;
    y: number;
};
export type SerializedPath = {
    lineWidth: number;
    strokeStyle: string;
    points: Point[];
};
export type UUIDandSerializedPath = {
    uuid: any;
    serializedPath: SerializedPath;
};
//# sourceMappingURL=Types.d.ts.map