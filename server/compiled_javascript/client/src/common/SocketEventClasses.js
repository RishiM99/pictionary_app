export class JoinRoom {
    static EVENT_NAME = 'join-room';
    roomName;
    constructor(roomName) {
        this.roomName = roomName;
    }
    convertToJSON() {
        return JSON.parse(JSON.stringify(this));
    }
    static createFromJSON(serializedJSON) {
        return new JoinRoom(serializedJSON.roomName);
    }
}
export class CreateRoom {
    static EVENT_NAME = 'create-room';
    roomName;
    constructor(roomName) {
        this.roomName = roomName;
    }
    convertToJSON() {
        return JSON.parse(JSON.stringify(this));
    }
    static createFromJSON(serializedJSON) {
        console.log(`Serialized JSON ${serializedJSON}`);
        return new CreateRoom(serializedJSON.roomName);
    }
}
export class ListOfRoomsAndMembers {
    static EVENT_NAME = 'list-of-rooms-and-members';
    listOfRoomsAndMembers;
    constructor(roomsAndMembersList) {
        this.listOfRoomsAndMembers = roomsAndMembersList;
    }
    convertToJSON() {
        return JSON.parse(JSON.stringify(this));
    }
    static createFromJSON(serializedJSON) {
        return new ListOfRoomsAndMembers(serializedJSON.listOfRoomsAndMembers);
    }
}
export class NameOfNewRoom {
    static EVENT_NAME = 'name-of-new-room';
    roomId;
    constructor(roomId) {
        this.roomId = roomId;
    }
    convertToJSON() {
        return JSON.parse(JSON.stringify(this));
    }
    static createFromJSON(serializedJSON) {
        return new NameOfNewRoom(serializedJSON.roomId);
    }
}
//# sourceMappingURL=SocketEventClasses.js.map