const { io } = require('socket.io-client');

const URL = window.location;

export const socket = io(URL);