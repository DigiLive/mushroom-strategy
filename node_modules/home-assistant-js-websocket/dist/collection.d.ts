import { Store } from "./store.js";
import { Connection } from "./connection.js";
import { UnsubscribeFunc } from "./types.js";
export type Collection<State> = {
    state: State;
    refresh(): Promise<void>;
    subscribe(subscriber: (state: State) => void): UnsubscribeFunc;
};
/**
 *
 * @param conn connection
 * @param key the key to store it on the connection. Must be unique for each collection.
 * @param fetchCollection fetch the current state. If undefined assumes subscribeUpdates receives current state
 * @param subscribeUpdates subscribe to updates on the current state
 * @returns
 */
export declare const getCollection: <State>(conn: Connection, key: string, fetchCollection: ((conn: Connection) => Promise<State>) | undefined, subscribeUpdates?: (conn: Connection, store: Store<State>) => Promise<UnsubscribeFunc>, options?: {
    unsubGrace: boolean;
}) => Collection<State>;
export declare const createCollection: <State>(key: string, fetchCollection: (conn: Connection) => Promise<State>, subscribeUpdates: ((conn: Connection, store: Store<State>) => Promise<UnsubscribeFunc>) | undefined, conn: Connection, onChange: (state: State) => void) => UnsubscribeFunc;
