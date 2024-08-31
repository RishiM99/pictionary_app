const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const express = require("express");
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const sessionStore = new pgSession({
  conString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari',
  tableName: 'session',
});

const PORT = process.env.PORT || 3001;

const app = express();

const server = createServer(app)

// socket.io Server
const io = new Server(server)

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.use(session({
  secret: 'l7xQ2zLX93',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));

// All other GET requests not handled before will return our React app
app.get('/', (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
  });

app.get('/setname', (req, res) => {
  req.session.name = "test_name";
  console.log(req.session);
  res.json({})
})

app.get('/getname', (req, res) => {
  console.log(req.session);
  res.json({ message: req.session.name });
})

io.on('connection', (socket) => {
    socket.on('create-room', (msg) => {
      console.log(msg);
      const userName = msg.userName; 
      const roomName = msg.roomName;
      console.log("ROOM NAME:");
      console.log(roomName);
      socket.userName = userName;
      socket.join(roomName);
      console.log(io.sockets.adapter.rooms);
      io.emit('list-of-rooms', io.sockets.adapter.rooms); 
    });
  });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});