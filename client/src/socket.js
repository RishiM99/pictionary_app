const { io } = require('socket.io-client');

export const socket = io(window.location.host);