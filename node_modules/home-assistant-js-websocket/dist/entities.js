import { getCollection } from "./collection.js";
import { getStates } from "./commands.js";
import { atLeastHaVersion } from "./util.js";
function processEvent(store, updates) {
    const state = Object.assign({}, store.state);
    if (updates.a) {
        for (const entityId in updates.a) {
            const newState = updates.a[entityId];
            let last_changed = new Date(newState.lc * 1000).toISOString();
            state[entityId] = {
                entity_id: entityId,
                state: newState.s,
                attributes: newState.a,
                context: typeof newState.c === "string"
                    ? { id: newState.c, parent_id: null, user_id: null }
                    : newState.c,
                last_changed: last_changed,
                last_updated: newState.lu
                    ? new Date(newState.lu * 1000).toISOString()
                    : last_changed,
            };
        }
    }
    if (updates.r) {
        for (const entityId of updates.r) {
            delete state[entityId];
        }
    }
    if (updates.c) {
        for (const entityId in updates.c) {
            let entityState = state[entityId];
            if (!entityState) {
                console.warn("Received state update for unknown entity", entityId);
                continue;
            }
            entityState = Object.assign({}, entityState);
            const { "+": toAdd, "-": toRemove } = updates.c[entityId];
            const attributesChanged = (toAdd === null || toAdd === void 0 ? void 0 : toAdd.a) || (toRemove === null || toRemove === void 0 ? void 0 : toRemove.a);
            const attributes = attributesChanged
                ? Object.assign({}, entityState.attributes) : entityState.attributes;
            if (toAdd) {
                if (toAdd.s !== undefined) {
                    entityState.state = toAdd.s;
                }
                if (toAdd.c) {
                    if (typeof toAdd.c === "string") {
                        entityState.context = Object.assign(Object.assign({}, entityState.context), { id: toAdd.c });
                    }
                    else {
                        entityState.context = Object.assign(Object.assign({}, entityState.context), toAdd.c);
                    }
                }
                if (toAdd.lc) {
                    entityState.last_updated = entityState.last_changed = new Date(toAdd.lc * 1000).toISOString();
                }
                else if (toAdd.lu) {
                    entityState.last_updated = new Date(toAdd.lu * 1000).toISOString();
                }
                if (toAdd.a) {
                    Object.assign(attributes, toAdd.a);
                }
            }
            if (toRemove === null || toRemove === void 0 ? void 0 : toRemove.a) {
                for (const key of toRemove.a) {
                    delete attributes[key];
                }
            }
            if (attributesChanged) {
                entityState.attributes = attributes;
            }
            state[entityId] = entityState;
        }
    }
    store.setState(state, true);
}
const subscribeUpdates = (conn, store) => conn.subscribeMessage((ev) => processEvent(store, ev), {
    type: "subscribe_entities",
});
function legacyProcessEvent(store, event) {
    const state = store.state;
    if (state === undefined)
        return;
    const { entity_id, new_state } = event.data;
    if (new_state) {
        store.setState({ [new_state.entity_id]: new_state });
    }
    else {
        const newEntities = Object.assign({}, state);
        delete newEntities[entity_id];
        store.setState(newEntities, true);
    }
}
async function legacyFetchEntities(conn) {
    const states = await getStates(conn);
    const entities = {};
    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        entities[state.entity_id] = state;
    }
    return entities;
}
const legacySubscribeUpdates = (conn, store) => conn.subscribeEvents((ev) => legacyProcessEvent(store, ev), "state_changed");
export const entitiesColl = (conn) => atLeastHaVersion(conn.haVersion, 2022, 4, 0)
    ? getCollection(conn, "_ent", undefined, subscribeUpdates)
    : getCollection(conn, "_ent", legacyFetchEntities, legacySubscribeUpdates);
export const subscribeEntities = (conn, onChange) => entitiesColl(conn).subscribe(onChange);
