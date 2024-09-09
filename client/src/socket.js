const { io } = require('socket.io-client');

export default function getSocket() {
    return io(window.location.host);
}