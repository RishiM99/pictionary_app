var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var express = require("express");
var path = require('path');
var pg = require('pg');
var createServer = require('node:http').createServer;
var Server = require('socket.io').Server;
var pgPool = new pg.Pool({
    connectionString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari'
});
var sessionStore = new pgSession({
    pool: pgPool,
    tableName: 'session',
});
var PORT = process.env.PORT || 3001;
var app = express();
var server = createServer(app);
// socket.io Server
var io = new Server(server);
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.use(express.json());
app.use(session({
    secret: 'l7xQ2zLX93',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // maxAge of 1 day
    }
}));
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});
app.post('/createUser', function (req, res) {
    console.log(req.body);
    req.session.userName = req.body.userName;
    console.log(req.session);
    res.end();
});
io.on('connection', function (socket) {
    socket.on('create-room', function (msg) {
        console.log(msg);
        var userName = msg.userName;
        var roomName = msg.roomName;
        console.log("ROOM NAME:");
        console.log(roomName);
        socket.userName = userName;
        socket.join(roomName);
        console.log(io.sockets.adapter.rooms);
        io.emit('list-of-rooms', io.sockets.adapter.rooms);
    });
});
server.listen(PORT, function () {
    console.log("Server listening on ".concat(PORT));
});
