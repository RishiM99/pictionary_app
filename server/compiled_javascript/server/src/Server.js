import session from 'express-session';
import connect_pg from 'connect-pg-simple';
import express from 'express';
import path from 'path';
import pg from 'pg';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import DBUtil from './DBUtil.js';
import * as Constants from './Constants.js';
const __dirname = import.meta.dirname;
const pgSession = connect_pg(session);
const pgPool = new pg.Pool({
    connectionString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari'
});
const sessionStore = new pgSession({
    pool: pgPool,
    tableName: 'session',
});
const app = express();
const server = createServer(app);
// socket.io Server
const io = new Server(server);
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.use(express.json());
const sessionMiddleware = session({
    secret: 'l7xQ2zLX93',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: Constants.MAX_AGE_OF_SESSION_MS
    }
});
const dbUtil = new DBUtil(pgPool);
await dbUtil.scheduleCleanUpOfExpiredSessions();
app.use(sessionMiddleware);
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});
app.post('/createUser', (req, res) => {
    req.session.userName = req.body.userName;
    res.end();
});
app.get('/getUserName', (req, res) => {
    res.json({ userName: req.session.userName ?? null });
});
io.engine.use(sessionMiddleware);
io.on('connection', async (socket) => {
    const request = socket.request;
    const sessionId = request.session.id;
    await dbUtil.addSocketIntoSocketsToSessionsTable(socket.id, sessionId);
    await dbUtil.addSocketToRelevantRoomsOnConnection(socket);
    socket.on('getListOfRoomsAndMembers', async () => {
        const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
        io.emit('listOfRoomsAndMembers', roomsAndMembersInfo);
    });
    socket.on('createRoom', async (requestedRoomName) => {
        const dedupedRoomName = await dbUtil.createNewRoomWithDeduplicatedRoomName(requestedRoomName);
        socket.join(dedupedRoomName);
        dbUtil.addSocketToRoom(socket.id, dedupedRoomName);
        const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
        io.emit('listOfRoomsAndMembers', roomsAndMembersInfo);
        socket.emit('nameOfNewRoom', dedupedRoomName);
    });
    socket.on('joinRoom', async (roomName) => {
        socket.join(roomName);
        dbUtil.addSocketToRoom(socket.id, roomName);
        const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
        io.emit('listOfRoomsAndMembers', roomsAndMembersInfo);
    });
    socket.on('drawingPathsDiffFromClient', async (msg) => {
        const { pathsDiff, width, height, roomId } = msg;
        socket.broadcast.to(roomId).emit('broadcastDrawingPathsDiff', { pathsDiff, width, height });
    });
    socket.on('getRoomStateUponJoining', async (roomName) => {
        if (!await dbUtil.doesRoomHaveAdditionalSocketsOtherThanThisSocket(roomName, socket.id)) {
            // Send empty RoomState if room is empty
            console.log("HERE");
            socket.emit("sendRoomStateUponJoining", { isRoomEmpty: true, paths: [], width: 0, height: 0 });
        }
        else {
            console.log('getRoomStateUponJoining');
            const exchngId = crypto.randomUUID();
            io.to(roomName).emit("requestCurrentRoomState", exchngId);
            io.on("sendCurrentRoomState", (exchangeId, roomState) => {
                if (exchangeId === exchngId) {
                    socket.emit("sendRoomStateUponJoining", roomState);
                }
            });
        }
    });
    socket.on('disconnect', async (reason) => {
        console.log("removing socket upon disconnect");
        await dbUtil.removeSocketUponDisconnection(socket);
        const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
        io.emit('listOfRoomsAndMembers', roomsAndMembersInfo);
    });
});
server.listen(Constants.PORT, () => {
    console.log(`Server listening on ${Constants.PORT}`);
});
//# sourceMappingURL=Server.js.map