const { io } = require('socket.io-client');

const URL = "http://pictionary-app-dev.us-west-2.elasticbeanstalk.com/";

export const socket = io(URL);