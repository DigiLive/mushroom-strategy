import { HassEntities, UnsubscribeFunc } from "./types.js";
import { Connection } from "./connection.js";
export declare const entitiesColl: (conn: Connection) => import("./collection.js").Collection<HassEntities>;
export declare const subscribeEntities: (conn: Connection, onChange: (state: HassEntities) => void) => UnsubscribeFunc;
