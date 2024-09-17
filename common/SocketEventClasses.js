"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameOfNewRoom = exports.ListOfRoomsAndMembers = exports.CreateRoom = exports.JoinRoom = void 0;
var JoinRoom = /** @class */ (function () {
    function JoinRoom(roomName) {
        this.roomName = roomName;
    }
    JoinRoom.prototype.convertToJSON = function () {
        return JSON.parse(JSON.stringify(this));
    };
    JoinRoom.createFromJSON = function (serializedJSON) {
        return new JoinRoom(serializedJSON.roomName);
    };
    JoinRoom.EVENT_NAME = 'join-room';
    return JoinRoom;
}());
exports.JoinRoom = JoinRoom;
var CreateRoom = /** @class */ (function () {
    function CreateRoom(roomName) {
        this.roomName = roomName;
    }
    CreateRoom.prototype.convertToJSON = function () {
        return JSON.parse(JSON.stringify(this));
    };
    CreateRoom.createFromJSON = function (serializedJSON) {
        return new CreateRoom(serializedJSON.roomName);
    };
    CreateRoom.EVENT_NAME = 'create-room';
    return CreateRoom;
}());
exports.CreateRoom = CreateRoom;
var ListOfRoomsAndMembers = /** @class */ (function () {
    function ListOfRoomsAndMembers(roomsAndMembersList) {
        this.listOfRoomsAndMembers = roomsAndMembersList;
    }
    ListOfRoomsAndMembers.prototype.convertToJSON = function () {
        return JSON.parse(JSON.stringify(this));
    };
    ListOfRoomsAndMembers.createFromJSON = function (serializedJSON) {
        return new ListOfRoomsAndMembers(serializedJSON.listOfRoomsAndMembers);
    };
    ListOfRoomsAndMembers.EVENT_NAME = 'list-of-rooms-and-members';
    return ListOfRoomsAndMembers;
}());
exports.ListOfRoomsAndMembers = ListOfRoomsAndMembers;
var NameOfNewRoom = /** @class */ (function () {
    function NameOfNewRoom(roomId) {
        this.roomId = roomId;
    }
    NameOfNewRoom.prototype.convertToJSON = function () {
        return JSON.parse(JSON.stringify(this));
    };
    NameOfNewRoom.createFromJSON = function (serializedJSON) {
        return new NameOfNewRoom(serializedJSON.roomId);
    };
    NameOfNewRoom.EVENT_NAME = 'name-of-new-room';
    return NameOfNewRoom;
}());
exports.NameOfNewRoom = NameOfNewRoom;
