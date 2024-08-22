const express = require("express");
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const app = express();

const server = createServer(app)

// socket.io Server
const io = new Server(server)

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

io.on('connection', (socket) => {
    socket.on('form-message', (msg) => {
      socket.emit("message-to-client", "Received message: " + msg)
    });
  });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});