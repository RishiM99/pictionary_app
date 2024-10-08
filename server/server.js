import session from 'express-session';
import connect_pg from 'connect-pg-simple';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import DBUtil from './DBUtil.js';
import * as Constants from './Constants.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname);

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
    res.json({userName: req.session.userName ?? null});
});

io.engine.use(sessionMiddleware);

io.on('connection', async (socket) => {
    const sessionId = socket.request.session.id;
    console.log(`Session Id: ${sessionId}`);
    await dbUtil.addSocketIntoSocketsToSessionsTable(socket.id, sessionId);
    await dbUtil.addSocketToRelevantRoomsOnConnection(socket);
    const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
    io.emit('list-of-rooms-and-members', roomsAndMembersInfo); 
  
    socket.on('create-room', async (msg) => {
      console.log(`Socket Id: ${socket.id}`);
      const requestedRoomName = msg.roomName;
      const dedupedRoomName = await dbUtil.createNewRoomWithDeduplicatedRoomName(requestedRoomName);
      socket.join(dedupedRoomName);
      dbUtil.addSocketToRoom(socket.id, dedupedRoomName);
      const roomsAndMembersInfo = await dbUtil.getRoomAndMembersInfo();
      io.emit('list-of-rooms-and-members', roomsAndMembersInfo); 
    });
  });

server.listen(Constants.PORT, () => {
  console.log(`Server listening on ${Constants.PORT}`);
});