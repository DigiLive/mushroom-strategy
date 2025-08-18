'use strict';

const ERR_CANNOT_CONNECT = 1;
const ERR_INVALID_AUTH = 2;
const ERR_CONNECTION_LOST = 3;
const ERR_HASS_HOST_REQUIRED = 4;
const ERR_INVALID_HTTPS_TO_HTTP = 5;
const ERR_INVALID_AUTH_CALLBACK = 6;

function auth(accessToken) {
    return {
        type: "auth",
        access_token: accessToken,
    };
}
function supportedFeatures() {
    return {
        type: "supported_features",
        id: 1, // Always the first message after auth
        features: { coalesce_messages: 1 },
    };
}
function states() {
    return {
        type: "get_states",
    };
}
function config() {
    return {
        type: "get_config",
    };
}
function services() {
    return {
        type: "get_services",
    };
}
function user() {
    return {
        type: "auth/current_user",
    };
}
function callService$1(domain, service, serviceData, target, returnResponse) {
    const message = {
        type: "call_service",
        domain,
        service,
        target,
        return_response: returnResponse,
    };
    if (serviceData) {
        message.service_data = serviceData;
    }
    return message;
}
function subscribeEvents(eventType) {
    const message = {
        type: "subscribe_events",
    };
    if (eventType) {
        message.event_type = eventType;
    }
    return message;
}
function unsubscribeEvents(subscription) {
    return {
        type: "unsubscribe_events",
        subscription,
    };
}
function ping() {
    return {
        type: "ping",
    };
}
function error(code, message) {
    return {
        type: "result",
        success: false,
        error: {
            code,
            message,
        },
    };
}

function parseQuery(queryString) {
    const query = {};
    const items = queryString.split("&");
    for (let i = 0; i < items.length; i++) {
        const item = items[i].split("=");
        const key = decodeURIComponent(item[0]);
        const value = item.length > 1 ? decodeURIComponent(item[1]) : undefined;
        query[key] = value;
    }
    return query;
}
// From: https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// eslint-disable-next-line: ban-types
const debounce = (func, wait, immediate = false) => {
    let timeout;
    // @ts-ignore
    return function (...args) {
        // @ts-ignore
        const context = this;
        const later = () => {
            timeout = undefined;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};
const atLeastHaVersion = (version, major, minor, patch) => {
    const [haMajor, haMinor, haPatch] = version.split(".", 3);
    return (Number(haMajor) > major ||
        (Number(haMajor) === major &&
            (patch === undefined
                ? Number(haMinor) >= minor
                : Number(haMinor) > minor)) ||
        (patch !== undefined &&
            Number(haMajor) === major &&
            Number(haMinor) === minor &&
            Number(haPatch) >= patch));
};

/**
 * Create a web socket connection with a Home Assistant instance.
 */
const MSG_TYPE_AUTH_REQUIRED = "auth_required";
const MSG_TYPE_AUTH_INVALID = "auth_invalid";
const MSG_TYPE_AUTH_OK = "auth_ok";
function createSocket(options) {
    if (!options.auth) {
        throw ERR_HASS_HOST_REQUIRED;
    }
    const auth$1 = options.auth;
    // Start refreshing expired tokens even before the WS connection is open.
    // We know that we will need auth anyway.
    let authRefreshTask = auth$1.expired
        ? auth$1.refreshAccessToken().then(() => {
            authRefreshTask = undefined;
        }, () => {
            authRefreshTask = undefined;
        })
        : undefined;
    // Convert from http:// -> ws://, https:// -> wss://
    const url = auth$1.wsUrl;
    function connect(triesLeft, promResolve, promReject) {
        const socket = new WebSocket(url);
        // If invalid auth, we will not try to reconnect.
        let invalidAuth = false;
        const closeMessage = () => {
            // If we are in error handler make sure close handler doesn't also fire.
            socket.removeEventListener("close", closeMessage);
            if (invalidAuth) {
                promReject(ERR_INVALID_AUTH);
                return;
            }
            // Reject if we no longer have to retry
            if (triesLeft === 0) {
                // We never were connected and will not retry
                promReject(ERR_CANNOT_CONNECT);
                return;
            }
            const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
            // Try again in a second
            setTimeout(() => connect(newTries, promResolve, promReject), 1000);
        };
        // Auth is mandatory, so we can send the auth message right away.
        const handleOpen = async (event) => {
            try {
                if (auth$1.expired) {
                    await (authRefreshTask ? authRefreshTask : auth$1.refreshAccessToken());
                }
                socket.send(JSON.stringify(auth(auth$1.accessToken)));
            }
            catch (err) {
                // Refresh token failed
                invalidAuth = err === ERR_INVALID_AUTH;
                socket.close();
            }
        };
        const handleMessage = async (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case MSG_TYPE_AUTH_INVALID:
                    invalidAuth = true;
                    socket.close();
                    break;
                case MSG_TYPE_AUTH_OK:
                    socket.removeEventListener("open", handleOpen);
                    socket.removeEventListener("message", handleMessage);
                    socket.removeEventListener("close", closeMessage);
                    socket.removeEventListener("error", closeMessage);
                    socket.haVersion = message.ha_version;
                    if (atLeastHaVersion(socket.haVersion, 2022, 9)) {
                        socket.send(JSON.stringify(supportedFeatures()));
                    }
                    promResolve(socket);
                    break;
            }
        };
        socket.addEventListener("open", handleOpen);
        socket.addEventListener("message", handleMessage);
        socket.addEventListener("close", closeMessage);
        socket.addEventListener("error", closeMessage);
    }
    return new Promise((resolve, reject) => connect(options.setupRetry, resolve, reject));
}

/**
 * Connection that wraps a socket and provides an interface to interact with
 * the Home Assistant websocket API.
 */
class Connection {
    constructor(socket, options) {
        this._handleMessage = (event) => {
            let messageGroup = JSON.parse(event.data);
            if (!Array.isArray(messageGroup)) {
                messageGroup = [messageGroup];
            }
            messageGroup.forEach((message) => {
                const info = this.commands.get(message.id);
                switch (message.type) {
                    case "event":
                        if (info) {
                            info.callback(message.event);
                        }
                        else {
                            console.warn(`Received event for unknown subscription ${message.id}. Unsubscribing.`);
                            this.sendMessagePromise(unsubscribeEvents(message.id)).catch((err) => {
                            });
                        }
                        break;
                    case "result":
                        // No info is fine. If just sendMessage is used, we did not store promise for result
                        if (info) {
                            if (message.success) {
                                info.resolve(message.result);
                                // Don't remove subscriptions.
                                if (!("subscribe" in info)) {
                                    this.commands.delete(message.id);
                                }
                            }
                            else {
                                info.reject(message.error);
                                this.commands.delete(message.id);
                            }
                        }
                        break;
                    case "pong":
                        if (info) {
                            info.resolve();
                            this.commands.delete(message.id);
                        }
                        else {
                            console.warn(`Received unknown pong response ${message.id}`);
                        }
                        break;
                }
            });
        };
        this._handleClose = async () => {
            const oldCommands = this.commands;
            // reset to original state except haVersion
            this.commandId = 1;
            this.oldSubscriptions = this.commands;
            this.commands = new Map();
            this.socket = undefined;
            // Reject in-flight sendMessagePromise requests
            oldCommands.forEach((info) => {
                // We don't cancel subscribeEvents commands in flight
                // as we will be able to recover them.
                if (!("subscribe" in info)) {
                    info.reject(error(ERR_CONNECTION_LOST, "Connection lost"));
                }
            });
            if (this.closeRequested) {
                return;
            }
            this.fireEvent("disconnected");
            // Disable setupRetry, we control it here with auto-backoff
            const options = Object.assign(Object.assign({}, this.options), { setupRetry: 0 });
            const reconnect = (tries) => {
                setTimeout(async () => {
                    if (this.closeRequested) {
                        return;
                    }
                    try {
                        const socket = await options.createSocket(options);
                        this._setSocket(socket);
                    }
                    catch (err) {
                        if (this._queuedMessages) {
                            const queuedMessages = this._queuedMessages;
                            this._queuedMessages = undefined;
                            for (const msg of queuedMessages) {
                                if (msg.reject) {
                                    msg.reject(ERR_CONNECTION_LOST);
                                }
                            }
                        }
                        if (err === ERR_INVALID_AUTH) {
                            this.fireEvent("reconnect-error", err);
                        }
                        else {
                            reconnect(tries + 1);
                        }
                    }
                }, Math.min(tries, 5) * 1000);
            };
            if (this.suspendReconnectPromise) {
                await this.suspendReconnectPromise;
                this.suspendReconnectPromise = undefined;
                // For the first retry after suspend, we will queue up
                // all messages.
                this._queuedMessages = [];
            }
            reconnect(0);
        };
        // connection options
        //  - setupRetry: amount of ms to retry when unable to connect on initial setup
        //  - createSocket: create a new Socket connection
        this.options = options;
        // id if next command to send
        this.commandId = 2; // socket may send 1 at the start to enable features
        // info about active subscriptions and commands in flight
        this.commands = new Map();
        // map of event listeners
        this.eventListeners = new Map();
        // true if a close is requested by the user
        this.closeRequested = false;
        this._setSocket(socket);
    }
    get connected() {
        // Using conn.socket.OPEN instead of WebSocket for better node support
        return (this.socket !== undefined && this.socket.readyState == this.socket.OPEN);
    }
    _setSocket(socket) {
        this.socket = socket;
        this.haVersion = socket.haVersion;
        socket.addEventListener("message", this._handleMessage);
        socket.addEventListener("close", this._handleClose);
        const oldSubscriptions = this.oldSubscriptions;
        if (oldSubscriptions) {
            this.oldSubscriptions = undefined;
            oldSubscriptions.forEach((info) => {
                if ("subscribe" in info && info.subscribe) {
                    info.subscribe().then((unsub) => {
                        info.unsubscribe = unsub;
                        // We need to resolve this in case it wasn't resolved yet.
                        // This allows us to subscribe while we're disconnected
                        // and recover properly.
                        info.resolve();
                    });
                }
            });
        }
        const queuedMessages = this._queuedMessages;
        if (queuedMessages) {
            this._queuedMessages = undefined;
            for (const queuedMsg of queuedMessages) {
                queuedMsg.resolve();
            }
        }
        this.fireEvent("ready");
    }
    addEventListener(eventType, callback) {
        let listeners = this.eventListeners.get(eventType);
        if (!listeners) {
            listeners = [];
            this.eventListeners.set(eventType, listeners);
        }
        listeners.push(callback);
    }
    removeEventListener(eventType, callback) {
        const listeners = this.eventListeners.get(eventType);
        if (!listeners) {
            return;
        }
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
    fireEvent(eventType, eventData) {
        (this.eventListeners.get(eventType) || []).forEach((callback) => callback(this, eventData));
    }
    suspendReconnectUntil(suspendPromise) {
        this.suspendReconnectPromise = suspendPromise;
    }
    suspend() {
        if (!this.suspendReconnectPromise) {
            throw new Error("Suspend promise not set");
        }
        if (this.socket) {
            this.socket.close();
        }
    }
    /**
     * Reconnect the websocket connection.
     * @param force discard old socket instead of gracefully closing it.
     */
    reconnect(force = false) {
        if (!this.socket) {
            return;
        }
        if (!force) {
            this.socket.close();
            return;
        }
        this.socket.removeEventListener("message", this._handleMessage);
        this.socket.removeEventListener("close", this._handleClose);
        this.socket.close();
        this._handleClose();
    }
    close() {
        this.closeRequested = true;
        if (this.socket) {
            this.socket.close();
        }
    }
    /**
     * Subscribe to a specific or all events.
     *
     * @param callback Callback  to be called when a new event fires
     * @param eventType
     * @returns promise that resolves to an unsubscribe function
     */
    async subscribeEvents(callback, eventType) {
        return this.subscribeMessage(callback, subscribeEvents(eventType));
    }
    ping() {
        return this.sendMessagePromise(ping());
    }
    sendMessage(message, commandId) {
        if (!this.connected) {
            throw ERR_CONNECTION_LOST;
        }
        if (this._queuedMessages) {
            if (commandId) {
                throw new Error("Cannot queue with commandId");
            }
            this._queuedMessages.push({ resolve: () => this.sendMessage(message) });
            return;
        }
        if (!commandId) {
            commandId = this._genCmdId();
        }
        message.id = commandId;
        this.socket.send(JSON.stringify(message));
    }
    sendMessagePromise(message) {
        return new Promise((resolve, reject) => {
            if (this._queuedMessages) {
                this._queuedMessages.push({
                    reject,
                    resolve: async () => {
                        try {
                            resolve(await this.sendMessagePromise(message));
                        }
                        catch (err) {
                            reject(err);
                        }
                    },
                });
                return;
            }
            const commandId = this._genCmdId();
            this.commands.set(commandId, { resolve, reject });
            this.sendMessage(message, commandId);
        });
    }
    /**
     * Call a websocket command that starts a subscription on the backend.
     *
     * @param message the message to start the subscription
     * @param callback the callback to be called when a new item arrives
     * @param [options.resubscribe] re-established a subscription after a reconnect. Defaults to true.
     * @returns promise that resolves to an unsubscribe function
     */
    async subscribeMessage(callback, subscribeMessage, options) {
        if (this._queuedMessages) {
            await new Promise((resolve, reject) => {
                this._queuedMessages.push({ resolve, reject });
            });
        }
        if (options === null || options === void 0 ? void 0 : options.preCheck) {
            const precheck = await options.preCheck();
            if (!precheck) {
                throw new Error("Pre-check failed");
            }
        }
        let info;
        await new Promise((resolve, reject) => {
            // Command ID that will be used
            const commandId = this._genCmdId();
            // We store unsubscribe on info object. That way we can overwrite it in case
            // we get disconnected and we have to subscribe again.
            info = {
                resolve,
                reject,
                callback,
                subscribe: (options === null || options === void 0 ? void 0 : options.resubscribe) !== false
                    ? () => this.subscribeMessage(callback, subscribeMessage, options)
                    : undefined,
                unsubscribe: async () => {
                    // No need to unsubscribe if we're disconnected
                    if (this.connected) {
                        await this.sendMessagePromise(unsubscribeEvents(commandId));
                    }
                    this.commands.delete(commandId);
                },
            };
            this.commands.set(commandId, info);
            try {
                this.sendMessage(subscribeMessage, commandId);
            }
            catch (err) {
                // Happens when the websocket is already closing.
                // Don't have to handle the error, reconnect logic will pick it up.
            }
        });
        return () => info.unsubscribe();
    }
    _genCmdId() {
        return ++this.commandId;
    }
}

const genClientId = () => `${location.protocol}//${location.host}/`;
const genExpires = (expires_in) => {
    return expires_in * 1000 + Date.now();
};
function genRedirectUrl() {
    // Get current url but without # part.
    const { protocol, host, pathname, search } = location;
    return `${protocol}//${host}${pathname}${search}`;
}
function genAuthorizeUrl(hassUrl, clientId, redirectUrl, state) {
    let authorizeUrl = `${hassUrl}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    if (clientId !== null) {
        authorizeUrl += `&client_id=${encodeURIComponent(clientId)}`;
    }
    if (state) {
        authorizeUrl += `&state=${encodeURIComponent(state)}`;
    }
    return authorizeUrl;
}
function redirectAuthorize(hassUrl, clientId, redirectUrl, state) {
    // Add either ?auth_callback=1 or &auth_callback=1
    redirectUrl += (redirectUrl.includes("?") ? "&" : "?") + "auth_callback=1";
    document.location.href = genAuthorizeUrl(hassUrl, clientId, redirectUrl, state);
}
async function tokenRequest(hassUrl, clientId, data) {
    // Browsers don't allow fetching tokens from https -> http.
    // Throw an error because it's a pain to debug this.
    // Guard against not working in node.
    const l = typeof location !== "undefined" && location;
    if (l && l.protocol === "https:") {
        // Ensure that the hassUrl is hosted on https.
        const a = document.createElement("a");
        a.href = hassUrl;
        if (a.protocol === "http:" && a.hostname !== "localhost") {
            throw ERR_INVALID_HTTPS_TO_HTTP;
        }
    }
    const formData = new FormData();
    if (clientId !== null) {
        formData.append("client_id", clientId);
    }
    Object.keys(data).forEach((key) => {
        // @ts-ignore
        formData.append(key, data[key]);
    });
    const resp = await fetch(`${hassUrl}/auth/token`, {
        method: "POST",
        credentials: "same-origin",
        body: formData,
    });
    if (!resp.ok) {
        throw resp.status === 400 /* auth invalid */ ||
            resp.status === 403 /* user not active */
            ? ERR_INVALID_AUTH
            : new Error("Unable to fetch tokens");
    }
    const tokens = await resp.json();
    tokens.hassUrl = hassUrl;
    tokens.clientId = clientId;
    tokens.expires = genExpires(tokens.expires_in);
    return tokens;
}
function fetchToken(hassUrl, clientId, code) {
    return tokenRequest(hassUrl, clientId, {
        code,
        grant_type: "authorization_code",
    });
}
function encodeOAuthState(state) {
    return btoa(JSON.stringify(state));
}
function decodeOAuthState(encoded) {
    return JSON.parse(atob(encoded));
}
class Auth {
    constructor(data, saveTokens) {
        this.data = data;
        this._saveTokens = saveTokens;
    }
    get wsUrl() {
        // Convert from http:// -> ws://, https:// -> wss://
        return `ws${this.data.hassUrl.substr(4)}/api/websocket`;
    }
    get accessToken() {
        return this.data.access_token;
    }
    get expired() {
        return Date.now() > this.data.expires;
    }
    /**
     * Refresh the access token.
     */
    async refreshAccessToken() {
        if (!this.data.refresh_token)
            throw new Error("No refresh_token");
        const data = await tokenRequest(this.data.hassUrl, this.data.clientId, {
            grant_type: "refresh_token",
            refresh_token: this.data.refresh_token,
        });
        // Access token response does not contain refresh token.
        data.refresh_token = this.data.refresh_token;
        this.data = data;
        if (this._saveTokens)
            this._saveTokens(data);
    }
    /**
     * Revoke the refresh & access tokens.
     */
    async revoke() {
        if (!this.data.refresh_token)
            throw new Error("No refresh_token to revoke");
        const formData = new FormData();
        formData.append("token", this.data.refresh_token);
        // There is no error checking, as revoke will always return 200
        await fetch(`${this.data.hassUrl}/auth/revoke`, {
            method: "POST",
            credentials: "same-origin",
            body: formData,
        });
        if (this._saveTokens) {
            this._saveTokens(null);
        }
    }
}
function createLongLivedTokenAuth(hassUrl, access_token) {
    return new Auth({
        hassUrl,
        clientId: null,
        expires: Date.now() + 1e11,
        refresh_token: "",
        access_token,
        expires_in: 1e11,
    });
}
async function getAuth(options = {}) {
    let data;
    let hassUrl = options.hassUrl;
    // Strip trailing slash.
    if (hassUrl && hassUrl[hassUrl.length - 1] === "/") {
        hassUrl = hassUrl.substr(0, hassUrl.length - 1);
    }
    const clientId = options.clientId !== undefined ? options.clientId : genClientId();
    const limitHassInstance = options.limitHassInstance === true;
    // Use auth code if it was passed in
    if (options.authCode && hassUrl) {
        data = await fetchToken(hassUrl, clientId, options.authCode);
        if (options.saveTokens) {
            options.saveTokens(data);
        }
    }
    // Check if we came back from an authorize redirect
    if (!data) {
        const query = parseQuery(location.search.substr(1));
        // Check if we got redirected here from authorize page
        if ("auth_callback" in query) {
            // Restore state
            const state = decodeOAuthState(query.state);
            if (limitHassInstance &&
                (state.hassUrl !== hassUrl || state.clientId !== clientId)) {
                throw ERR_INVALID_AUTH_CALLBACK;
            }
            data = await fetchToken(state.hassUrl, state.clientId, query.code);
            if (options.saveTokens) {
                options.saveTokens(data);
            }
        }
    }
    // Check for stored tokens
    if (!data && options.loadTokens) {
        data = await options.loadTokens();
    }
    // If the token is for another url, ignore it
    if (data && (hassUrl === undefined || data.hassUrl === hassUrl)) {
        return new Auth(data, options.saveTokens);
    }
    if (hassUrl === undefined) {
        throw ERR_HASS_HOST_REQUIRED;
    }
    // If no tokens found but a hassUrl was passed in, let's go get some tokens!
    redirectAuthorize(hassUrl, clientId, options.redirectUrl || genRedirectUrl(), encodeOAuthState({
        hassUrl,
        clientId,
    }));
    // Just don't resolve while we navigate to next page
    return new Promise(() => { });
}

const createStore = (state) => {
    let listeners = [];
    function unsubscribe(listener) {
        let out = [];
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener) {
                listener = null;
            }
            else {
                out.push(listeners[i]);
            }
        }
        listeners = out;
    }
    function setState(update, overwrite) {
        state = overwrite ? update : Object.assign(Object.assign({}, state), update);
        let currentListeners = listeners;
        for (let i = 0; i < currentListeners.length; i++) {
            currentListeners[i](state);
        }
    }
    /**
     * An observable state container, returned from {@link createStore}
     * @name store
     */
    return {
        get state() {
            return state;
        },
        /**
         * Create a bound copy of the given action function.
         * The bound returned function invokes action() and persists the result back to the store.
         * If the return value of `action` is a Promise, the resolved value will be used as state.
         * @param {Function} action	An action of the form `action(state, ...args) -> stateUpdate`
         * @returns {Function} boundAction()
         */
        action(action) {
            function apply(result) {
                setState(result, false);
            }
            // Note: perf tests verifying this implementation: https://esbench.com/bench/5a295e6299634800a0349500
            return function () {
                let args = [state];
                for (let i = 0; i < arguments.length; i++)
                    args.push(arguments[i]);
                // @ts-ignore
                let ret = action.apply(this, args);
                if (ret != null) {
                    return ret instanceof Promise ? ret.then(apply) : apply(ret);
                }
            };
        },
        /**
         * Apply a partial state object to the current state, invoking registered listeners.
         * @param {Object} update				An object with properties to be merged into state
         * @param {Boolean} [overwrite=false]	If `true`, update will replace state instead of being merged into it
         */
        setState,
        clearState() {
            state = undefined;
        },
        /**
         * Register a listener function to be called whenever state is changed. Returns an `unsubscribe()` function.
         * @param {Function} listener	A function to call when state changes. Gets passed the new state.
         * @returns {Function} unsubscribe()
         */
        subscribe(listener) {
            listeners.push(listener);
            return () => {
                unsubscribe(listener);
            };
        },
        // /**
        //  * Remove a previously-registered listener function.
        //  * @param {Function} listener	The callback previously passed to `subscribe()` that should be removed.
        //  * @function
        //  */
        // unsubscribe,
    };
};

// Time to wait to unsubscribe from updates after last subscriber unsubscribes
const UNSUB_GRACE_PERIOD = 5000; // 5 seconds
/**
 *
 * @param conn connection
 * @param key the key to store it on the connection. Must be unique for each collection.
 * @param fetchCollection fetch the current state. If undefined assumes subscribeUpdates receives current state
 * @param subscribeUpdates subscribe to updates on the current state
 * @returns
 */
const getCollection = (conn, key, fetchCollection, subscribeUpdates, options = { unsubGrace: true }) => {
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
            clearTimeout(unsubTimer);
            unsubTimer = undefined;
            return;
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
const createCollection = (key, fetchCollection, subscribeUpdates, conn, onChange) => getCollection(conn, key, fetchCollection, subscribeUpdates).subscribe(onChange);

const getStates = (connection) => connection.sendMessagePromise(states());
const getServices = (connection) => connection.sendMessagePromise(services());
const getConfig = (connection) => connection.sendMessagePromise(config());
const getUser = (connection) => connection.sendMessagePromise(user());
const callService = (connection, domain, service, serviceData, target, returnResponse) => connection.sendMessagePromise(callService$1(domain, service, serviceData, target, returnResponse));

function processComponentLoaded(state, event) {
    if (state === undefined)
        return null;
    return {
        components: state.components.concat(event.data.component),
    };
}
const fetchConfig = (conn) => getConfig(conn);
const subscribeUpdates$2 = (conn, store) => Promise.all([
    conn.subscribeEvents(store.action(processComponentLoaded), "component_loaded"),
    conn.subscribeEvents(() => fetchConfig(conn).then((config) => store.setState(config, true)), "core_config_updated"),
]).then((unsubs) => () => unsubs.forEach((unsub) => unsub()));
const configColl = (conn) => getCollection(conn, "_cnf", fetchConfig, subscribeUpdates$2);
const subscribeConfig = (conn, onChange) => configColl(conn).subscribe(onChange);
const STATE_NOT_RUNNING = "NOT_RUNNING";
const STATE_STARTING = "STARTING";
const STATE_RUNNING = "RUNNING";
const STATE_STOPPING = "STOPPING";
const STATE_FINAL_WRITE = "FINAL_WRITE";

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
const subscribeUpdates$1 = (conn, store) => Promise.all([
    conn.subscribeEvents((ev) => processServiceRegistered(conn, store, ev), "service_registered"),
    conn.subscribeEvents(store.action(processServiceRemoved), "service_removed"),
]).then((unsubs) => () => unsubs.forEach((fn) => fn()));
const servicesColl = (conn) => getCollection(conn, "_srv", fetchServices, subscribeUpdates$1);
const subscribeServices = (conn, onChange) => servicesColl(conn).subscribe(onChange);

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
const entitiesColl = (conn) => atLeastHaVersion(conn.haVersion, 2022, 4, 0)
    ? getCollection(conn, "_ent", undefined, subscribeUpdates)
    : getCollection(conn, "_ent", legacyFetchEntities, legacySubscribeUpdates);
const subscribeEntities = (conn, onChange) => entitiesColl(conn).subscribe(onChange);

// JS extensions in imports allow tsc output to be consumed by browsers.
async function createConnection(options) {
    const connOptions = Object.assign({ setupRetry: 0, createSocket }, options);
    const socket = await connOptions.createSocket(connOptions);
    const conn = new Connection(socket, connOptions);
    return conn;
}

exports.Auth = Auth;
exports.Connection = Connection;
exports.ERR_CANNOT_CONNECT = ERR_CANNOT_CONNECT;
exports.ERR_CONNECTION_LOST = ERR_CONNECTION_LOST;
exports.ERR_HASS_HOST_REQUIRED = ERR_HASS_HOST_REQUIRED;
exports.ERR_INVALID_AUTH = ERR_INVALID_AUTH;
exports.ERR_INVALID_AUTH_CALLBACK = ERR_INVALID_AUTH_CALLBACK;
exports.ERR_INVALID_HTTPS_TO_HTTP = ERR_INVALID_HTTPS_TO_HTTP;
exports.MSG_TYPE_AUTH_INVALID = MSG_TYPE_AUTH_INVALID;
exports.MSG_TYPE_AUTH_OK = MSG_TYPE_AUTH_OK;
exports.MSG_TYPE_AUTH_REQUIRED = MSG_TYPE_AUTH_REQUIRED;
exports.STATE_FINAL_WRITE = STATE_FINAL_WRITE;
exports.STATE_NOT_RUNNING = STATE_NOT_RUNNING;
exports.STATE_RUNNING = STATE_RUNNING;
exports.STATE_STARTING = STATE_STARTING;
exports.STATE_STOPPING = STATE_STOPPING;
exports.callService = callService;
exports.configColl = configColl;
exports.createCollection = createCollection;
exports.createConnection = createConnection;
exports.createLongLivedTokenAuth = createLongLivedTokenAuth;
exports.createSocket = createSocket;
exports.createStore = createStore;
exports.entitiesColl = entitiesColl;
exports.genClientId = genClientId;
exports.genExpires = genExpires;
exports.getAuth = getAuth;
exports.getCollection = getCollection;
exports.getConfig = getConfig;
exports.getServices = getServices;
exports.getStates = getStates;
exports.getUser = getUser;
exports.servicesColl = servicesColl;
exports.subscribeConfig = subscribeConfig;
exports.subscribeEntities = subscribeEntities;
exports.subscribeServices = subscribeServices;
