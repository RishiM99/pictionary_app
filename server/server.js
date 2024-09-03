import session from 'express-session';
import connect_pg from 'connect-pg-simple';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const pgSession = connect_pg(session);

const pgPool = new pg.Pool({
  connectionString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari'
})

const sessionStore = new pgSession({
  pool: pgPool,
  tableName: 'session',
});

const PORT = process.env.PORT || 3001;

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
    maxAge: 24 * 60 * 60 * 1000 // maxAge of 1 day
  }
});

app.use(sessionMiddleware);

app.get('/', (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
  });

app.post('/createUser', (req, res) => { 
    console.log(req.body);
    req.session.userName = req.body.userName;
    console.log(req.session);
    res.end();
  });
app.get('/getUserName', (req, res) => {
    console.log(req.session.id);
    res.json({userName: req.session.userName ?? null});
});

io.engine.use(sessionMiddleware);

io.on('connection', async (socket) => {
    const sessionId = socket.request.session.id;
    console.log(sessionId);
    const result = await pgPool.query("INSERT INTO sockets_to_sessions (socket_id, session_id) VALUES ($1, $2)", [socket.id, sessionId]);
    console.log(result);
    socket.on('create-room', (msg) => {
      console.log(msg);
      const userName = msg.userName; 
      const roomName = msg.roomName;
      console.log("ROOM NAME:");
      console.log(roomName);
      socket.join(roomName);
      console.log(io.sockets.adapter.rooms);
      io.emit('list-of-rooms', io.sockets.adapter.rooms); 
    });
  });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});