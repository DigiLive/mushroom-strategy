import { HassConfig, UnsubscribeFunc } from "./types.js";
import { Connection } from "./connection.js";
export declare const configColl: (conn: Connection) => import("./collection.js").Collection<HassConfig>;
export declare const subscribeConfig: (conn: Connection, onChange: (state: HassConfig) => void) => UnsubscribeFunc;
export declare const STATE_NOT_RUNNING = "NOT_RUNNING";
export declare const STATE_STARTING = "STARTING";
export declare const STATE_RUNNING = "RUNNING";
export declare const STATE_STOPPING = "STOPPING";
export declare const STATE_FINAL_WRITE = "FINAL_WRITE";
