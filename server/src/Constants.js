"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_AGE_OF_SESSION_MS = exports.PORT = void 0;
exports.PORT = process.env.PORT || 3001;
exports.MAX_AGE_OF_SESSION_MS = 24 * 60 * 60 * 1000; // max age of 1 day, in milliseconds
