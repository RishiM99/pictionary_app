export class JoinRoom {
    static EVENT_NAME: string = 'join-room';
    roomName: string;

    constructor(roomName: string) {
        this.roomName = roomName;
    }

    convertToJSON(): JSON {
        return JSON.parse(JSON.stringify(this));
    }

    static createFromJSON(serializedJSON: { roomName: string }): JoinRoom {
        return new JoinRoom(serializedJSON.roomName);
    }
}

export class CreateRoom {
    static EVENT_NAME: string = 'create-room';
    roomName: string;

    constructor(roomName: string) {
        this.roomName = roomName;
    }

    convertToJSON(): JSON {
        return JSON.parse(JSON.stringify(this));
    }

    static createFromJSON(serializedJSON: any): CreateRoom {
        console.log(`Serialized JSON ${serializedJSON}`);
        return new CreateRoom(serializedJSON.roomName);
    }
}

export module ListOfRoomsAndMembersTypes {
    export type roomAndMembers = {
        roomId: any;
        membersNames: any[];
        displayTextForMembers: string;
    };
}

export class ListOfRoomsAndMembers {
    static EVENT_NAME: string = 'list-of-rooms-and-members';

    listOfRoomsAndMembers: ListOfRoomsAndMembersTypes.roomAndMembers[];

    constructor(roomsAndMembersList: ListOfRoomsAndMembersTypes.roomAndMembers[]) {
        this.listOfRoomsAndMembers = roomsAndMembersList;
    }

    convertToJSON(): JSON {
        return JSON.parse(JSON.stringify(this));
    }

    static createFromJSON(serializedJSON: { listOfRoomsAndMembers: ListOfRoomsAndMembersTypes.roomAndMembers[] }): ListOfRoomsAndMembers {
        return new ListOfRoomsAndMembers(serializedJSON.listOfRoomsAndMembers);
    }
}

export class NameOfNewRoom {
    static EVENT_NAME: string = 'name-of-new-room';
    roomId: string;

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    convertToJSON(): JSON {
        return JSON.parse(JSON.stringify(this));
    }

    static createFromJSON(serializedJSON: { roomId: string }): NameOfNewRoom {
        return new NameOfNewRoom(serializedJSON.roomId);
    }
}
