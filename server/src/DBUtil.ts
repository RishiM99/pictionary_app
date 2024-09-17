import * as Constants from './Constants.js';
import assert from 'assert';
import pg from 'pg';
import { Socket } from 'socket.io';

const MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES = 25;

export default class DBUtil {
    pgPool: pg.Pool;

    constructor(pgPool: pg.Pool) {
        this.pgPool = pgPool;
    }

    // If no params, set to [].
    async #selectAndExtractSingleColumn(sql: string, params: any[], column: string, sqlClient: pg.PoolClient | null = null) {
        if (sqlClient == null) {
            return (await this.pgPool.query(sql, params)).rows.map((row) => row[column]);
        } else {
            return (await sqlClient.query(sql, params)).rows.map((row) => row[column]);
        }
    }

    async scheduleCleanUpOfExpiredSessions() {
        this.#cleanUpExpiredSessionsHelper();
        setInterval(async () => { await this.#cleanUpExpiredSessionsHelper() }, Constants.MAX_AGE_OF_SESSION_MS);
    }
    async #cleanUpExpiredSessionsHelper() {
        // extract(epoch from expire) returns number of seconds, need number of millseconds since that's what Javascript returns
        const sessionsWithUTCTime = await this.pgPool.query("SELECT sid, extract(epoch from expire)*1000 AS expire_utc FROM session");
        let sessionsToRemove = [];
        const currentTime = new Date().getTime();
        for (const { sid, expire_utc } of sessionsWithUTCTime.rows) {
            if (Number(expire_utc) < currentTime) {
                sessionsToRemove.push(sid);
            }
        }
        const socketsToRemove = await this.#selectAndExtractSingleColumn("SELECT socket_id FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove], "socket_id");

        await this.pgPool.query("DELETE FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove]);
        await this.pgPool.query("DELETE FROM session WHERE sid = ANY ($1)", [sessionsToRemove])
        await this.pgPool.query("DELETE FROM sockets_to_rooms WHERE socket_id = ANY ($1)", [socketsToRemove])
    }

    async addSocketIntoSocketsToSessionsTable(socketId: string, sessionId: string) {
        await this.pgPool.query("INSERT INTO sockets_to_sessions (socket_id, session_id) VALUES ($1, $2)", [socketId, sessionId]);
    }

    async addSocketToRelevantRoomsOnConnection(socket: Socket) {
        const roomsSocketIsIn = await this.#selectAndExtractSingleColumn("SELECT room_id FROM sockets_to_rooms WHERE socket_id = $1", [socket.id], "room_id");
        for (const roomId of roomsSocketIsIn) {
            socket.join(roomId);
        }
    }

    async addSocketToRoom(socketId: string, roomId: string) {
        await this.pgPool.query("INSERT INTO sockets_to_rooms (socket_id, room_id) VALUES ($1, $2)", [socketId, roomId]);
    }

    async createNewRoomWithDeduplicatedRoomName(roomName: string): Promise<string> {
        // Create individual client for transaction
        const client = await this.pgPool.connect();
        try {
            await client.query('BEGIN');

            const alreadyExistingRooms = await this.#selectAndExtractSingleColumn("SELECT room_id FROM rooms WHERE room_id = $1", [roomName], "room_id", client);
            let dedupedRoomName;
            if (alreadyExistingRooms.length > 0) {
                const existingDedupSuffixResp = await this.#selectAndExtractSingleColumn("SELECT duplicate_count FROM room_id_base_to_duplicates_count WHERE room_id_base = $1", [roomName], "duplicate_count", client);
                assert(existingDedupSuffixResp.length === 1);
                const existingDedupSuffix = existingDedupSuffixResp[0];
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
        const rooms = await this.#selectAndExtractSingleColumn("SELECT room_id FROM rooms", [], "room_id");
        console.log(`Rooms: ${rooms}`);
        let roomAndMembersInfo = [];
        for (const roomId of rooms) {
            const socketsInRoom = await this.#selectAndExtractSingleColumn("SELECT socket_id FROM sockets_to_rooms WHERE room_id = $1", [roomId], "socket_id");
            const membersNames = [];
            for (const socketId of socketsInRoom) {
                const sessionIdResp = await this.#selectAndExtractSingleColumn("SELECT session_id FROM sockets_to_sessions WHERE socket_id = $1", [socketId], "session_id");
                assert(sessionIdResp.length === 1);
                const sessionId = sessionIdResp[0];
                const sessionResp = await this.#selectAndExtractSingleColumn("SELECT sess FROM session WHERE sid = $1", [sessionId], "sess");
                assert(sessionResp.length === 1);
                //TODO: FIGURE OUT WHY USERNAME CAN BE NULL
                if (sessionResp[0].userName != null) {
                    membersNames.push(sessionResp[0].userName);
                }
            }
            let displayTextForMembers = [];
            let currLength = 0;
            let count = 0;
            for (const memberName of membersNames) {
                currLength += memberName.length;
                if (currLength > MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES) {
                    break;
                }
                displayTextForMembers.push(memberName);
                count += 1;
            }
            if (currLength > MAX_NUMBER_OF_CHARS_FOR_MEMBER_NAMES) {
                displayTextForMembers.push(`and ${membersNames.length - count} others.`);
            }
            roomAndMembersInfo.push({
                roomId: roomId,
                membersNames: membersNames,
                displayTextForMembers: displayTextForMembers.join(", "),
            });
        }
        return roomAndMembersInfo;
    }
}

