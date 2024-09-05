export async function cleanUpExpiredSessions(pgPool) {
    // extract(epoch from expire) returns number of seconds, need number of millseconds since that's what Javascript returns
    const sessionsWithUTCTime = await pgPool.query("SELECT sid, extract(epoch from expire)*1000 AS expire_utc FROM session");
    let sessionsToRemove = []; 
    const currentTime = new Date().getTime();
    for (const {sid, expire_utc} of sessionsWithUTCTime.rows) {
        if (Number(expire_utc) < currentTime) {
            sessionsToRemove.push(sid);
        }
    }
    const socketsToRemove = (await pgPool.query("SELECT socket_id FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove])).rows.map((row) => row.socket_id);

    await pgPool.query("DELETE FROM sockets_to_sessions WHERE session_id = ANY ($1)", [sessionsToRemove]);
    await pgPool.query("DELETE FROM session WHERE sid = ANY ($1)", [sessionsToRemove])
    await pgPool.query("DELETE FROM sockets_to_rooms WHERE socket_id = ANY ($1)", [socketsToRemove])
}