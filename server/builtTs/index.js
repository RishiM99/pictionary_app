var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var express = require("express");
var path = require('path');
var createServer = require('node:http').createServer;
var Server = require('socket.io').Server;
var sessionStore = new pgSession({
    conString: 'postgres://rishimaheshwari@localhost:5432/rishimaheshwari',
    tableName: 'session',
});
var PORT = process.env.PORT || 3001;
var app = express();
var server = createServer(app);
// socket.io Server
var io = new Server(server);
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.use(session({
    secret: 'l7xQ2zLX93',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));
// All other GET requests not handled before will return our React app
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});
app.get('/setname', function (req, res) {
    req.session.name = "test_name";
    console.log(req.session);
    res.json({});
});
app.get('/getname', function (req, res) {
    console.log(req.session);
    res.json({ message: req.session.name });
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
