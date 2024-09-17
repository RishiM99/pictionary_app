declare module 'express-session' {
    interface SessionData {
        userName: string;
    }
}
declare module 'http' {
    interface IncomingMessage {
        session: any;
    }
}
export {};
//# sourceMappingURL=Server.d.ts.map