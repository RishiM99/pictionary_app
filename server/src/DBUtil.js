"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DBUtil_instances, _DBUtil_selectAndExtractSingleColumn, _DBUtil_cleanUpExpiredSessionsHelper;
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = require("./Constants.js");
var assert_1 = require("assert");
var MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES = 25;
var DBUtil = /** @class */ (function () {
    function DBUtil(pgPool) {
        _DBUtil_instances.add(this);
        this.pgPool = pgPool;
    }
    DBUtil.prototype.scheduleCleanUpOfExpiredSessions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_cleanUpExpiredSessionsHelper).call(this);
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_cleanUpExpiredSessionsHelper).call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                }); }); }, Constants.MAX_AGE_OF_SESSION_MS);
                return [2 /*return*/];
            });
        });
    };
    DBUtil.prototype.addSocketIntoSocketsToSessionsTable = function (socketId, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pgPool.query("INSERT INTO sockets_to_sessions (socket_id, session_id) VALUES ($1, $2)", [socketId, sessionId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DBUtil.prototype.addSocketToRelevantRoomsOnConnection = function (socket) {
        return __awaiter(this, void 0, void 0, function () {
            var roomsSocketIsIn, _i, roomsSocketIsIn_1, roomId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT room_id FROM sockets_to_rooms WHERE socket_id = $1", [socket.id], "room_id")];
                    case 1:
                        roomsSocketIsIn = _a.sent();
                        for (_i = 0, roomsSocketIsIn_1 = roomsSocketIsIn; _i < roomsSocketIsIn_1.length; _i++) {
                            roomId = roomsSocketIsIn_1[_i];
                            socket.join(roomId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DBUtil.prototype.addSocketToRoom = function (socketId, roomId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pgPool.query("INSERT INTO sockets_to_rooms (socket_id, room_id) VALUES ($1, $2)", [socketId, roomId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DBUtil.prototype.createNewRoomWithDeduplicatedRoomName = function (roomName) {
        return __awaiter(this, void 0, void 0, function () {
            var client, alreadyExistingRooms, dedupedRoomName, existingDedupSuffixResp, existingDedupSuffix, newDedupSuffix, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pgPool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 13, 15, 16]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT room_id FROM rooms WHERE room_id = $1", [roomName], "room_id", client)];
                    case 4:
                        alreadyExistingRooms = _a.sent();
                        dedupedRoomName = void 0;
                        if (!(alreadyExistingRooms.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT duplicate_count FROM room_id_base_to_duplicates_count WHERE room_id_base = $1", [roomName], "duplicate_count", client)];
                    case 5:
                        existingDedupSuffixResp = _a.sent();
                        (0, assert_1.default)(existingDedupSuffixResp.length === 1);
                        existingDedupSuffix = existingDedupSuffixResp[0];
                        newDedupSuffix = existingDedupSuffix + 1;
                        return [4 /*yield*/, client.query("UPDATE room_id_base_to_duplicates_count SET duplicate_count = $1 WHERE room_id_base = $2", [newDedupSuffix, roomName])];
                    case 6:
                        _a.sent();
                        dedupedRoomName = roomName + newDedupSuffix;
                        return [4 /*yield*/, client.query("INSERT INTO rooms (room_id) VALUES ($1)", [dedupedRoomName])];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, client.query("INSERT INTO rooms (room_id) VALUES ($1)", [roomName])];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, client.query("INSERT INTO room_id_base_to_duplicates_count (room_id_base, duplicate_count) VALUES ($1, $2)", [roomName, 0])];
                    case 10:
                        _a.sent();
                        dedupedRoomName = roomName;
                        _a.label = 11;
                    case 11: return [4 /*yield*/, client.query('COMMIT')];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, dedupedRoomName];
                    case 13:
                        e_1 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 14:
                        _a.sent();
                        throw e_1;
                    case 15:
                        client.release();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    DBUtil.prototype.getRoomAndMembersInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rooms, roomAndMembersInfo, _i, rooms_1, roomId, socketsInRoom, membersNames, _a, socketsInRoom_1, socketId, sessionIdResp, sessionId, sessionResp, displayTextForMembers, currLength, count, _b, membersNames_1, memberName;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT room_id FROM rooms", [], "room_id")];
                    case 1:
                        rooms = _c.sent();
                        console.log("Rooms: ".concat(rooms));
                        roomAndMembersInfo = [];
                        _i = 0, rooms_1 = rooms;
                        _c.label = 2;
                    case 2:
                        if (!(_i < rooms_1.length)) return [3 /*break*/, 10];
                        roomId = rooms_1[_i];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT socket_id FROM sockets_to_rooms WHERE room_id = $1", [roomId], "socket_id")];
                    case 3:
                        socketsInRoom = _c.sent();
                        membersNames = [];
                        _a = 0, socketsInRoom_1 = socketsInRoom;
                        _c.label = 4;
                    case 4:
                        if (!(_a < socketsInRoom_1.length)) return [3 /*break*/, 8];
                        socketId = socketsInRoom_1[_a];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT session_id FROM sockets_to_sessions WHERE socket_id = $1", [socketId], "session_id")];
                    case 5:
                        sessionIdResp = _c.sent();
                        (0, assert_1.default)(sessionIdResp.length === 1);
                        sessionId = sessionIdResp[0];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT sess FROM session WHERE sid = $1", [sessionId], "sess")];
                    case 6:
                        sessionResp = _c.sent();
                        (0, assert_1.default)(sessionResp.length === 1);
                        //TODO: FIGURE OUT WHY USERNAME CAN BE NULL
                        if (sessionResp[0].userName != null) {
                            membersNames.push(sessionResp[0].userName);
                        }
                        _c.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 4];
                    case 8:
                        displayTextForMembers = [];
                        currLength = 0;
                        count = 0;
                        for (_b = 0, membersNames_1 = membersNames; _b < membersNames_1.length; _b++) {
                            memberName = membersNames_1[_b];
                            currLength += memberName.length;
                            if (currLength > MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES) {
                                break;
                            }
                            displayTextForMembers.push(memberName);
                            count += 1;
                        }
                        if (currLength > MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES) {
                            displayTextForMembers.push("and ".concat(membersNames.length - count, " others."));
                        }
                        roomAndMembersInfo.push({
                            roomId: roomId,
                            membersNames: membersNames,
                            displayTextForMembers: displayTextForMembers.join(", "),
                        });
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10: return [2 /*return*/, roomAndMembersInfo];
                }
            });
        });
    };
    return DBUtil;
}());
_DBUtil_instances = new WeakSet(), _DBUtil_selectAndExtractSingleColumn = function _DBUtil_selectAndExtractSingleColumn(sql_1, params_1, column_1) {
    return __awaiter(this, arguments, void 0, function (sql, params, column, sqlClient) {
        if (sqlClient === void 0) { sqlClient = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(sqlClient == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.pgPool.query(sql, params)];
                case 1: return [2 /*return*/, (_a.sent()).rows.map(function (row) { return row[column]; })];
                case 2: return [4 /*yield*/, sqlClient.query(sql, params)];
                case 3: return [2 /*return*/, (_a.sent()).rows.map(function (row) { return row[column]; })];
            }
        });
    });
}, _DBUtil_cleanUpExpiredSessionsHelper = function _DBUtil_cleanUpExpiredSessionsHelper() {
    return __awaiter(this, void 0, void 0, function () {
        var sessionsWithUTCTime, sessionsToRemove, currentTime, _i, _a, _b, sid, expire_utc, socketsToRemove;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, this.pgPool.query("SELECT sid, extract(epoch from expire)*1000 AS expire_utc FROM session")];
                case 1:
                    sessionsWithUTCTime = _c.sent();
                    sessionsToRemove = [];
                    currentTime = new Date().getTime();
                    for (_i = 0, _a = sessionsWithUTCTime.rows; _i < _a.length; _i++) {
                        _b = _a[_i], sid = _b.sid, expire_utc = _b.expire_utc;
                        if (Number(expire_utc) < currentTime) {
                            sessionsToRemove.push(sid);
                        }
                    }
                    return [4 /*yield*/, __classPrivateFieldGet(this, _DBUtil_instances, "m", _DBUtil_selectAndExtractSingleColumn).call(this, "SELECT socket_id FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove], "socket_id")];
                case 2:
                    socketsToRemove = _c.sent();
                    return [4 /*yield*/, this.pgPool.query("DELETE FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove])];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, this.pgPool.query("DELETE FROM session WHERE sid = ANY ($1)", [sessionsToRemove])];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, this.pgPool.query("DELETE FROM sockets_to_rooms WHERE socket_id = ANY ($1)", [socketsToRemove])];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.default = DBUtil;
