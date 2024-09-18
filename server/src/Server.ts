import session from 'express-session';
import connect_pg from 'connect-pg-simple';
import express from 'express';
import path from 'path';
import pg from 'pg';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import DBUtil from './DBUtil.js';
import * as Constants from './Constants.js';
import { JoinRoom, CreateRoom, ListOfRoomsAndMembers, NameOfNewRoom } from "../../client/src/common/SocketEventClasses.js";
import { type Request } from "express";


declare module 'express-session' {
  interface SessionData {
    userName: string;
  }
}

const __dirname = import.meta.dirname;

const pgSession = connect_pg(session);

const pgPool = new pg.Pool({
  connectionString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari'
})

const sessionStore = new pgSession({
  pool: pgPool,
  tableName: 'session',
});

const app = express();

const server = createServer(app)

// socket.io Server
const io = new Server(server)

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.use(express.json())

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
  const request = socket.request as Request;
  const sessionId = request.session.id;
  console.log(`Session Id: ${sessionId}`);
  await dbUtil.addSocketIntoSocketsToSessionsTable(socket.id, sessionId);
  await dbUtil.addSocketToRelevantRoomsOnConnection(socket);

  socket.on('get-list-of-rooms-and-members', async () => {
    const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
    io.emit(ListOfRoomsAndMembers.EVENT_NAME, new ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
  });

  socket.on(CreateRoom.EVENT_NAME, async (msg) => {
    console.log(msg);
    console.log(typeof (msg));
    console.log(`Socket Id: ${socket.id}`);
    const requestedRoomName = CreateRoom.createFromJSON(msg).roomName;
    console.log(`requested room name ${requestedRoomName}`);
    const dedupedRoomName = await dbUtil.createNewRoomWithDeduplicatedRoomName(requestedRoomName);
    socket.join(dedupedRoomName);
    dbUtil.addSocketToRoom(socket.id, dedupedRoomName);
    const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
    io.emit(ListOfRoomsAndMembers.EVENT_NAME, new ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
    socket.emit(NameOfNewRoom.EVENT_NAME, new NameOfNewRoom(dedupedRoomName).convertToJSON());
  });

  socket.on(JoinRoom.EVENT_NAME, async (msg) => {
    console.log(`Socket Id: ${socket.id}`);
    const roomName = JoinRoom.createFromJSON(msg).roomName;
    socket.join(roomName);
    dbUtil.addSocketToRoom(socket.id, roomName);
    const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
    io.emit(ListOfRoomsAndMembers.EVENT_NAME, new ListOfRoomsAndMembers(roomsAndMembersInfo).convertToJSON());
  });

  // socket.on('broadcast-drawing-paths-diff', async (msg) => {
  //   const { pathsDiff, roomName } = msg;
  //   io.to(roomName).emit('updated-drawing-paths-diff', pathsDiff);
  // });
});

server.listen(Constants.PORT, () => {
  console.log(`Server listening on ${Constants.PORT}`);
});