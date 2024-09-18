export type RoomAndMembers = {
    roomId: any;
    membersNames: any[];
    displayTextForMembers: string;
};
export interface ServerToClientEvents {
    listOfRoomsAndMembers: (listOfRoomsAndMembers: RoomAndMembers[]) => void;
    nameOfNewRoom: (roomId: string) => void;
}
export interface ClientToServerEvents {
    createRoom: (roomName: string) => void;
    joinRoom: (roomName: string) => void;
    getListOfRoomsAndMembers: () => void;
}
//# sourceMappingURL=SocketEvents.d.ts.map