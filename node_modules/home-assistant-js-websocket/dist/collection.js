import { createStore } from "./store.js";
// Time to wait to unsubscribe from updates after last subscriber unsubscribes
const UNSUB_GRACE_PERIOD = 5000; // 5 seconds
const DEBUG = false;
/**
 *
 * @param conn connection
 * @param key the key to store it on the connection. Must be unique for each collection.
 * @param fetchCollection fetch the current state. If undefined assumes subscribeUpdates receives current state
 * @param subscribeUpdates subscribe to updates on the current state
 * @returns
 */
export const getCollection = (conn, key, fetchCollection, subscribeUpdates, options = { unsubGrace: true }) => {
    // @ts-ignore
    if (conn[key]) {
        // @ts-ignore
        return conn[key];
    }
    let active = 0;
    let unsubProm;
    let unsubTimer;
    let store = createStore();
    const refresh = () => {
        if (!fetchCollection) {
            throw new Error("Collection does not support refresh");
        }
        return fetchCollection(conn).then((state) => store.setState(state, true));
    };
    const refreshSwallow = () => refresh().catch((err) => {
        // Swallow errors if socket is connecting, closing or closed.
        // We will automatically call refresh again when we re-establish the connection.
        if (conn.connected) {
            throw err;
        }
    });
    const setupUpdateSubscription = () => {
        if (unsubTimer !== undefined) {
            if (DEBUG) {
                console.log(`Prevented unsubscribe for ${key}`);
            }
            clearTimeout(unsubTimer);
            unsubTimer = undefined;
            return;
        }
        if (DEBUG) {
            console.log(`Subscribing to ${key}`);
        }
        if (subscribeUpdates) {
            unsubProm = subscribeUpdates(conn, store);
        }
        if (fetchCollection) {
            // Fetch when connection re-established.
            conn.addEventListener("ready", refreshSwallow);
            refreshSwallow();
        }
        conn.addEventListener("disconnected", handleDisconnect);
    };
    const teardownUpdateSubscription = () => {
        if (DEBUG) {
            console.log(`Unsubscribing from ${key}`);
        }
        unsubTimer = undefined;
        // Unsubscribe from changes
        if (unsubProm)
            unsubProm.then((unsub) => {
                unsub();
            });
        store.clearState();
        conn.removeEventListener("ready", refresh);
        conn.removeEventListener("disconnected", handleDisconnect);
    };
    const scheduleTeardownUpdateSubscription = () => {
        if (DEBUG) {
            console.log(`Scheduling unsubscribing from ${key}`);
        }
        unsubTimer = setTimeout(teardownUpdateSubscription, UNSUB_GRACE_PERIOD);
    };
    const handleDisconnect = () => {
        // If we're going to unsubscribe and then lose connection,
        // just unsubscribe immediately.
        if (unsubTimer) {
            clearTimeout(unsubTimer);
            teardownUpdateSubscription();
        }
    };
    // @ts-ignore
    conn[key] = {
        get state() {
            return store.state;
        },
        refresh,
        subscribe(subscriber) {
            active++;
            if (DEBUG) {
                console.log(`New subscriber for ${key}. Active subscribers: ${active}`);
            }
            // If this was the first subscriber, attach collection
            if (active === 1) {
                setupUpdateSubscription();
            }
            const unsub = store.subscribe(subscriber);
            if (store.state !== undefined) {
                // Don't call it right away so that caller has time
                // to initialize all the things.
                setTimeout(() => subscriber(store.state), 0);
            }
            return () => {
                unsub();
                active--;
                if (DEBUG) {
                    console.log(`Unsubscribe for ${key}. Active subscribers: ${active}`);
                }
                if (!active) {
                    options.unsubGrace
                        ? scheduleTeardownUpdateSubscription()
                        : teardownUpdateSubscription();
                }
            };
        },
    };
    // @ts-ignore
    return conn[key];
};
// Legacy name. It gets a collection and subscribes.
export const createCollection = (key, fetchCollection, subscribeUpdates, conn, onChange) => getCollection(conn, key, fetchCollection, subscribeUpdates).subscribe(onChange);
