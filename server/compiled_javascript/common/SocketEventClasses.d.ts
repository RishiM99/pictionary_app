export declare class JoinRoom {
    static EVENT_NAME: string;
    roomName: string;
    constructor(roomName: string);
    convertToJSON(): JSON;
    static createFromJSON(serializedJSON: {
        roomName: string;
    }): JoinRoom;
}
export declare class CreateRoom {
    static EVENT_NAME: string;
    roomName: string;
    constructor(roomName: string);
    convertToJSON(): JSON;
    static createFromJSON(serializedJSON: {
        roomName: string;
    }): CreateRoom;
}
export declare namespace ListOfRoomsAndMembersTypes {
    type roomAndMembers = {
        roomId: any;
        membersNames: any[];
        displayTextForMembers: string;
    };
}
export declare class ListOfRoomsAndMembers {
    static EVENT_NAME: string;
    listOfRoomsAndMembers: ListOfRoomsAndMembersTypes.roomAndMembers[];
    constructor(roomsAndMembersList: ListOfRoomsAndMembersTypes.roomAndMembers[]);
    convertToJSON(): JSON;
    static createFromJSON(serializedJSON: {
        listOfRoomsAndMembers: ListOfRoomsAndMembersTypes.roomAndMembers[];
    }): ListOfRoomsAndMembers;
}
export declare class NameOfNewRoom {
    static EVENT_NAME: string;
    roomId: string;
    constructor(roomId: string);
    convertToJSON(): JSON;
    static createFromJSON(serializedJSON: {
        roomId: string;
    }): NameOfNewRoom;
}
//# sourceMappingURL=SocketEventClasses.d.ts.map