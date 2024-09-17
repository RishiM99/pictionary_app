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

    static createFromJSON(serializedJSON: { roomName: string }): JoinRoom {
        return new JoinRoom(serializedJSON.roomName);
    }
}

export class GetListOfRoomsAndMembers {
    static EVENT_NAME: string = 'get-list-of-rooms-and-members';
}

export class ListOfRoomsAndMembers {
    static EVENT_NAME: string = 'list-of-rooms-and-members';
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
