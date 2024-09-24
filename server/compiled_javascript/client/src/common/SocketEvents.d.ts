import { UUIDandSerializedPath } from '../helpers/Types';
export type RoomAndMembers = {
    roomId: any;
    membersNames: any[];
    displayTextForMembers: string;
};
export type DrawingPathsDiffFromClientType = {
    pathsDiff: UUIDandSerializedPath[];
    width: number;
    height: number;
    roomId: string;
};
export type BroadcastDrawingPathsDiffType = {
    pathsDiff: UUIDandSerializedPath[];
    width: number;
    height: number;
};
export interface ServerToClientEvents {
    listOfRoomsAndMembers: (listOfRoomsAndMembers: RoomAndMembers[]) => void;
    nameOfNewRoom: (roomId: string) => void;
    broadcastDrawingPathsDiff: (msg: BroadcastDrawingPathsDiffType) => void;
}
export interface ClientToServerEvents {
    createRoom: (roomName: string) => void;
    joinRoom: (roomName: string) => void;
    getListOfRoomsAndMembers: () => void;
    drawingPathsDiffFromClient: (msg: DrawingPathsDiffFromClientType) => void;
}
//# sourceMappingURL=SocketEvents.d.ts.map