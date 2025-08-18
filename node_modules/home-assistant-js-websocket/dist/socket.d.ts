import type { ConnectionOptions } from "./connection.js";
export declare const MSG_TYPE_AUTH_REQUIRED = "auth_required";
export declare const MSG_TYPE_AUTH_INVALID = "auth_invalid";
export declare const MSG_TYPE_AUTH_OK = "auth_ok";
export interface HaWebSocket extends WebSocket {
    haVersion: string;
}
export declare function createSocket(options: ConnectionOptions): Promise<HaWebSocket>;
