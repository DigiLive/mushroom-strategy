import { getCollection } from "./collection.js";
import { getConfig } from "./commands.js";
function processComponentLoaded(state, event) {
    if (state === undefined)
        return null;
    return {
        components: state.components.concat(event.data.component),
    };
}
const fetchConfig = (conn) => getConfig(conn);
const subscribeUpdates = (conn, store) => Promise.all([
    conn.subscribeEvents(store.action(processComponentLoaded), "component_loaded"),
    conn.subscribeEvents(() => fetchConfig(conn).then((config) => store.setState(config, true)), "core_config_updated"),
]).then((unsubs) => () => unsubs.forEach((unsub) => unsub()));
export const configColl = (conn) => getCollection(conn, "_cnf", fetchConfig, subscribeUpdates);
export const subscribeConfig = (conn, onChange) => configColl(conn).subscribe(onChange);
export const STATE_NOT_RUNNING = "NOT_RUNNING";
export const STATE_STARTING = "STARTING";
export const STATE_RUNNING = "RUNNING";
export const STATE_STOPPING = "STOPPING";
export const STATE_FINAL_WRITE = "FINAL_WRITE";
