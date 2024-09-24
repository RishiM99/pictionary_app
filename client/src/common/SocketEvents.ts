import { SerializedPath } from '../helpers/Types.ts';

export type RoomAndMembers = {
    roomId: any;
    membersNames: any[];
    displayTextForMembers: string;
};

export type DrawingPathsDiffFromClientType = {
    pathsDiff: Map<any, SerializedPath>,
    width: number,
    height: number,
    roomId: string,
};

export type BroadcastDrawingPathsDiffType = {
    pathsDiff: Map<any, SerializedPath>,
    width: number,
    height: number,
};

export interface ServerToClientEvents {
    listOfRoomsAndMembers: (listOfRoomsAndMembers: RoomAndMembers[]) => void;
    nameOfNewRoom: (roomId: string) => void;
    broadcastDrawingPathsDiff: (input: BroadcastDrawingPathsDiffType) => void;
}

export interface ClientToServerEvents {
    createRoom: (roomName: string) => void;
    joinRoom: (roomName: string) => void;
    getListOfRoomsAndMembers: () => void;
    drawingPathsDiffFromClient: (input: DrawingPathsDiffFromClientType) => void;
}