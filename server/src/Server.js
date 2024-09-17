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
Object.defineProperty(exports, "__esModule", { value: true });
var express_session_1 = require("express-session");
var connect_pg_simple_1 = require("connect-pg-simple");
var express_1 = require("express");
var path_1 = require("path");
var pg_1 = require("pg");
var node_http_1 = require("node:http");
var socket_io_1 = require("socket.io");
var DBUtil_js_1 = require("./DBUtil.js");
var Constants = require("./Constants.js");
var SocketEventClasses_js_1 = require("../../common/SocketEventClasses.js");
// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname);
var pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
var pgPool = new pg_1.default.Pool({
    connectionString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari'
});
var sessionStore = new pgSession({
    pool: pgPool,
    tableName: 'session',
});
var app = (0, express_1.default)();
var server = (0, node_http_1.createServer)(app);
// socket.io Server
var io = new socket_io_1.Server(server);
// Have Node serve the files for our built React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../client/build')));
app.use(express_1.default.json());
var sessionMiddleware = (0, express_session_1.default)({
    secret: 'l7xQ2zLX93',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: Constants.MAX_AGE_OF_SESSION_MS
    }
});
var dbUtil = new DBUtil_js_1.default(pgPool);
await dbUtil.scheduleCleanUpOfExpiredSessions();
app.use(sessionMiddleware);
app.get('/', function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, '../../client/build', 'index.html'));
});
app.post('/createUser', function (req, res) {
    req.session.userName = req.body.userName;
    res.end();
});
app.get('/getUserName', function (req, res) {
    var _a;
    res.json({ userName: (_a = req.session.userName) !== null && _a !== void 0 ? _a : null });
});
io.engine.use(sessionMiddleware);
io.on('connection', function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sessionId = socket.request.session.id;
                console.log("Session Id: ".concat(sessionId));
                return [4 /*yield*/, dbUtil.addSocketIntoSocketsToSessionsTable(socket.id, sessionId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, dbUtil.addSocketToRelevantRoomsOnConnection(socket)];
            case 2:
                _a.sent();
                socket.on('get-list-of-rooms-and-members', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var roomsAndMembersInfo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dbUtil.getRoomAndMembersInfo()];
                            case 1:
                                roomsAndMembersInfo = _a.sent();
                                io.emit(SocketEventClasses_js_1.ListOfRoomsAndMembers.EVENT_NAME, new SocketEventClasses_js_1.ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
                                return [2 /*return*/];
                        }
                    });
                }); });
                socket.on(SocketEventClasses_js_1.CreateRoom.EVENT_NAME, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var requestedRoomName, dedupedRoomName, roomsAndMembersInfo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Socket Id: ".concat(socket.id));
                                requestedRoomName = SocketEventClasses_js_1.CreateRoom.createFromJSON(msg).roomName;
                                return [4 /*yield*/, dbUtil.createNewRoomWithDeduplicatedRoomName(requestedRoomName)];
                            case 1:
                                dedupedRoomName = _a.sent();
                                socket.join(dedupedRoomName);
                                dbUtil.addSocketToRoom(socket.id, dedupedRoomName);
                                return [4 /*yield*/, dbUtil.getRoomAndMembersInfo()];
                            case 2:
                                roomsAndMembersInfo = _a.sent();
                                io.emit(SocketEventClasses_js_1.ListOfRoomsAndMembers.EVENT_NAME, new SocketEventClasses_js_1.ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
                                socket.emit(SocketEventClasses_js_1.NameOfNewRoom.EVENT_NAME, new SocketEventClasses_js_1.NameOfNewRoom(dedupedRoomName).convertToJSON());
                                return [2 /*return*/];
                        }
                    });
                }); });
                socket.on(SocketEventClasses_js_1.JoinRoom.EVENT_NAME, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var roomName, roomsAndMembersInfo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Socket Id: ".concat(socket.id));
                                roomName = SocketEventClasses_js_1.JoinRoom.createFromJSON(msg).roomName;
                                socket.join(roomName);
                                dbUtil.addSocketToRoom(socket.id, roomName);
                                return [4 /*yield*/, dbUtil.getRoomAndMembersInfo()];
                            case 1:
                                roomsAndMembersInfo = _a.sent();
                                io.emit(SocketEventClasses_js_1.ListOfRoomsAndMembers.EVENT_NAME, new SocketEventClasses_js_1.ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
server.listen(Constants.PORT, function () {
    console.log("Server listening on ".concat(Constants.PORT));
});
