import { HassServices, UnsubscribeFunc } from "./types.js";
import { Connection } from "./connection.js";
export declare const servicesColl: (conn: Connection) => import("./collection.js").Collection<HassServices>;
export declare const subscribeServices: (conn: Connection, onChange: (state: HassServices) => void) => UnsubscribeFunc;
