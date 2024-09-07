import * as Constants from './Constants.js';
import assert from 'assert';

export default class DBUtil {
    constructor(pgPool) {
        this.pgPool = pgPool;
    }

    async scheduleCleanUpOfExpiredSessions() {
        this.#cleanUpExpiredSessionsHelper(); 
        setInterval(async () => {await this.#cleanUpExpiredSessionsHelper()}, Constants.MAX_AGE_OF_SESSION_MS);
    }
    async #cleanUpExpiredSessionsHelper() {
        // extract(epoch from expire) returns number of seconds, need number of millseconds since that's what Javascript returns
        const sessionsWithUTCTime = await this.pgPool.query("SELECT sid, extract(epoch from expire)*1000 AS expire_utc FROM session");
        let sessionsToRemove = []; 
        const currentTime = new Date().getTime();
        for (const {sid, expire_utc} of sessionsWithUTCTime.rows) {
            if (Number(expire_utc) < currentTime) {
                sessionsToRemove.push(sid);
            }
        }
        const socketsToRemove = (await this.pgPool.query("SELECT socket_id FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove])).rows.map((row) => row.socket_id);
    
        await this.pgPool.query("DELETE FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove]);
        await this.pgPool.query("DELETE FROM session WHERE sid = ANY ($1)", [sessionsToRemove])
        await this.pgPool.query("DELETE FROM sockets_to_rooms WHERE socket_id = ANY ($1)", [socketsToRemove])
    }
    
    async addSocketIntoSocketsToSessionsTable(socketId, sessionId) {
        await this.pgPool.query("INSERT INTO sockets_to_sessions (socket_id, session_id) VALUES ($1, $2)", [socketId, sessionId]);
    }

    async addSocketToRelevantRoomsOnConnection(socket) {
        const roomsSocketIsIn = (await this.pgPool.query("SELECT room_id FROM sockets_to_rooms WHERE socket_id = $1", [socket.id])).rows.map((row) => row.room_id);
        for (const roomId of roomsSocketIsIn) {
          socket.join(roomId);
        }
    }

    async addSocketToRoom(socketId, roomId) {
        await this.pgPool.query("INSERT INTO sockets_to_rooms (socket_id, room_id) VALUES ($1, $2)", [socketId, roomId]);
    }

    async createNewRoomWithDeduplicatedRoomName(roomName) {
        // Create individual client for transaction
        const client = await this.pgPool.connect();
        try {
            await client.query('BEGIN');

            const alreadyExistingRooms = (await client.query("SELECT room_id FROM rooms WHERE room_id = $1", [roomName])).rows;
            const doesRoomAlreadyExist = Array.isArray(alreadyExistingRooms) && alreadyExistingRooms.length > 0;
            let dedupedRoomName;
            if (doesRoomAlreadyExist) {
                const existingDedupSuffixResp = (await client.query("SELECT duplicate_count FROM room_id_base_to_duplicates_count WHERE room_id_base = $1", [roomName])).rows;
                assert(Array.isArray(existingDedupSuffixResp) && existingDedupSuffixResp.length === 1);
                const existingDedupSuffix = existingDedupSuffixResp.map((row) => row.duplicate_count)[0];
                const newDedupSuffix = existingDedupSuffix + 1;
                await client.query("UPDATE room_id_base_to_duplicates_count SET duplicate_count = $1 WHERE room_id_base = $2", [newDedupSuffix, roomName]);
                dedupedRoomName = roomName + newDedupSuffix;
                await client.query("INSERT INTO rooms (room_id) VALUES ($1)", [dedupedRoomName]);
            } else {
                await client.query("INSERT INTO rooms (room_id) VALUES ($1)", [roomName]);
                await client.query("INSERT INTO room_id_base_to_duplicates_count (room_id_base, duplicate_count) VALUES ($1, $2)", [roomName, 0]);
                dedupedRoomName = roomName;
            }

            await client.query('COMMIT');
            return dedupedRoomName;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async getRoomAndMembersInfo() {
        const rooms = (await this.pgPool.query("SELECT room_id FROM rooms")).rows.map((row) => row.room_id);
        console.log(rooms);
        let roomAndMembersInfo = [];
        for (const roomId of rooms) {
          const socketsInRoom = (await this.pgPool.query("SELECT socket_id FROM sockets_to_rooms WHERE room_id = $1", [roomId])).rows.map((row) => row.socket_id);
          console.log(roomId);
          console.log(socketsInRoom);
          const membersNames = [];
          for (const socketId of socketsInRoom) {
            console.log(socketId);
            const sessionResp = (await this.pgPool.query("SELECT session_id FROM sockets_to_sessions WHERE socket_id = $1", [socketId])).rows;
            console.log(sessionResp);
            if (sessionResp.length === 0) {
                continue;
            }
            const sessionId = sessionResp.map((row) => row.session_id)[0];
            const memberName = ((await this.pgPool.query("SELECT sess FROM session WHERE sid = $1", [sessionId])).rows.map((row) => row.sess)[0]).userName;
            membersNames.push(memberName);
          }
          roomAndMembersInfo.push({
            roomId: roomId, 
            membersNames: membersNames,
          });
        }
        return roomAndMembersInfo;
    }
}

