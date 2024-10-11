import pg from 'pg';
import { Socket } from 'socket.io';
export default class DBUtil {
    #private;
    pgPool: pg.Pool;
    constructor(pgPool: pg.Pool);
    scheduleCleanUpOfExpiredSessions(): Promise<void>;
    addSocketIntoSocketsToSessionsTable(socketId: string, sessionId: string): Promise<void>;
    addSocketToRelevantRoomsOnConnection(socket: Socket): Promise<void>;
    addSocketToRoom(socketId: string, roomId: string): Promise<void>;
    createNewRoomWithDeduplicatedRoomName(roomName: string): Promise<string>;
    doesRoomHaveAdditionalSocketsOtherThanThisSocket(roomId: string, socketId: string): Promise<boolean>;
    getRoomAndMembersInfo(): Promise<{
        roomId: any;
        membersNames: any[];
        displayTextForMembers: string;
    }[]>;
}
//# sourceMappingURL=DBUtil.d.ts.map