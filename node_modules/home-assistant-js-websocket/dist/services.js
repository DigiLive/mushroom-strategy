import { getCollection } from "./collection.js";
import { getServices } from "./commands.js";
import { debounce } from "./util.js";
function processServiceRegistered(conn, store, event) {
    var _a;
    const state = store.state;
    if (state === undefined)
        return;
    const { domain, service } = event.data;
    if (!((_a = state.domain) === null || _a === void 0 ? void 0 : _a.service)) {
        const domainInfo = Object.assign(Object.assign({}, state[domain]), { [service]: { description: "", fields: {} } });
        store.setState({ [domain]: domainInfo });
    }
    debouncedFetchServices(conn, store);
}
function processServiceRemoved(state, event) {
    if (state === undefined)
        return null;
    const { domain, service } = event.data;
    const curDomainInfo = state[domain];
    if (!curDomainInfo || !(service in curDomainInfo))
        return null;
    const domainInfo = {};
    Object.keys(curDomainInfo).forEach((sKey) => {
        if (sKey !== service)
            domainInfo[sKey] = curDomainInfo[sKey];
    });
    return { [domain]: domainInfo };
}
const debouncedFetchServices = debounce((conn, store) => fetchServices(conn).then((services) => store.setState(services, true)), 5000);
const fetchServices = (conn) => getServices(conn);
const subscribeUpdates = (conn, store) => Promise.all([
    conn.subscribeEvents((ev) => processServiceRegistered(conn, store, ev), "service_registered"),
    conn.subscribeEvents(store.action(processServiceRemoved), "service_removed"),
]).then((unsubs) => () => unsubs.forEach((fn) => fn()));
export const servicesColl = (conn) => getCollection(conn, "_srv", fetchServices, subscribeUpdates);
export const subscribeServices = (conn, onChange) => servicesColl(conn).subscribe(onChange);
