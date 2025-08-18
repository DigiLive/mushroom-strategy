# :aerial_tramway: JavaScript websocket client for Home Assistant

This is a websocket client written in JavaScript that allows retrieving authentication tokens and communicate with the Home Assistant websocket API. It can be used to integrate Home Assistant into your apps. It has 0 dependencies.

## Trying it out

Check [the demo](https://hass-auth-demo.glitch.me/). The repository also includes an [example client](https://github.com/home-assistant/home-assistant-js-websocket/blob/master/example.html):

Clone this repository, then go to home-assistant-js-websocket folder and run the following commands:

```bash
yarn install
yarn build
npx http-server -o
# A browser will open, navigate to example.html
```

## Installation

```bash
# With npm
npm i home-assistant-js-websocket

# With yarn
yarn add home-assistant-js-websocket
```

## Usage

To initialize a connection, you need an authentication token for the instance that you want to connect to. This library implements the necessary steps to guide the user to authenticate your website with their Home Assistant instance and give you a token. All you need from the user is the url of their instance.

```js
// Example connect code
import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
} from "home-assistant-js-websocket";

async function connect() {
  let auth;
  try {
    // Try to pick up authentication after user logs in
    auth = await getAuth();
  } catch (err) {
    if (err === ERR_HASS_HOST_REQUIRED) {
      const hassUrl = prompt(
        "What host to connect to?",
        "http://localhost:8123",
      );
      // Redirect user to log in on their instance
      auth = await getAuth({ hassUrl });
    } else {
      alert(`Unknown error: ${err}`);
      return;
    }
  }
  const connection = await createConnection({ auth });
  subscribeEntities(connection, (ent) => console.log(ent));
}

connect();
```

### `getAuth()`

Use this method to get authentication from a server via OAuth2. This method will handle redirecting to an instance and fetching the token after the user successful logs in.

You can pass options using the syntax:

```js
getAuth({ hassUrl: "http://localhost:8123" });
```

| Option            | Description                                                                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hassUrl           | The url where the Home Assistant instance can be reached. This option is needed so we know where to redirect the user for authentication. Once redirected back, it is not needed to pass this option in. |
| clientId          | Client ID to use. Client IDs for Home Assistant is the url of your application. Defaults to domain of current page. Pass `null` if you are making requests on behalf of a system user.                   |
| redirectUrl       | The url to redirect back to when the user has logged in. Defaults to current page.                                                                                                                       |
| saveTokens        | Function to store an object containing the token information.                                                                                                                                            |
| loadTokens        | Function that returns a promise that resolves to previously stored token information object or undefined if no info available.                                                                           |
| authCode          | If you have an auth code received via other means, you can pass it in and it will be used to fetch tokens instead of going through the OAuth2 flow.                                                      |
| limitHassInstance | If set to true, allow only authentication credentials for the passed in `hassUrl` and `clientId`. Defaults to false.                                                                                     |

In certain instances `getAuth` will raise an error. These errors can be imported from the package:

```js
// When bundling your application
import {
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
} from "home-assistant-js-websocket";

// When using the UMD build
HAWS.ERR_HASS_HOST_REQUIRED;
```

| Error                       | Description                                                                                                                                                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_HASS_HOST_REQUIRED`    | You need to pass in `hassUrl` to `getAuth` to continue getting auth. This option is not needed when the user is redirected back after successfully logging in.                                                                                                                                                                                          |
| `ERR_INVALID_AUTH`          | This error will be raised if the url contains an authorization code that is no longer valid.                                                                                                                                                                                                                                                            |
| `ERR_INVALID_HTTPS_TO_HTTP` | This error is raised if your code is being run from a secure context (hosted via https) and you're trying to fetch tokens from a Home Assistant instance via a non secure context (http). This is called [mixed active content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content) and the browser forbids this. |
| `ERR_INVALID_AUTH_CALLBACK` | This error is raised if only credentials for the specified Home Assistant instance are allowed and the client ID or hassURL in the auth callback state do not match the expected ones.                                                                                                                                                                  |
| Other errors                | Unknown error!                                                                                                                                                                                                                                                                                                                                          |

### `createConnection()`

You need to either provide `auth` or `createSocket` as options to createConnection:

```js
createConnection({ auth });
```

| Option       | Description                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| auth         | Auth object to use to create a connection.                                                                                                     |
| createSocket | Override the createSocket method with your own. `(options) => Promise<WebSocket>`. Needs to return a connection that is already authenticated. |
| setupRetry   | Number of times to retry initial connection when it fails. Set to -1 for infinite retries. Default is 0 (no retries)                           |

Currently the following error codes can be raised by createConnection:

| Error              | Description                                               |
| ------------------ | --------------------------------------------------------- |
| ERR_CANNOT_CONNECT | If the client was unable to connect to the websocket API. |
| ERR_INVALID_AUTH   | If the supplied authentication was invalid.               |

You can import them into your code as follows:

```javascript
import {
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
} from "home-assistant-js-websocket";
```

### Automatic reconnecting

The connection object will automatically try to reconnect to the server when the connection gets lost. On reconnect, it will automatically resubscribe the event listeners.

#### Suspend reconnection

If you don't want to automatically try to reconnect to the server when the connection is lost, you can pass a promise to wait for. The connection will try to reconnect after the promise is resolved.

```javascript
connection.suspendReconnectUntil(
  new Promise((resolve) => {
    // When you want to try to reconnect again, resolve the promise.
    resolve();
  }),
);
```

When the suspend promise resolves until the connection is re-established, all messages being send will be delayed until the connection is established. If the first reconnect fails, the queued messages will be rejected.

#### Suspend connection

You can also actively close the connection and wait for a promise to resolve to reconnect again. This promise can be passed either with `suspendReconnectUntil` or with the `suspend` command itself.

If you don't provide a promise with either of these functions, an error will be thrown.

```javascript
connection.suspendReconnectUntil(
  new Promise((resolve) => {
    // When you want to try to reconnect again, resolve the promise.
    resolve();
  }),
);
connection.suspend();
```

or

```javascript
connection.suspend(
  new Promise((resolve) => {
    // When you want to try to reconnect again, resolve the promise.
    resolve();
  }),
);
```

#### Close connection

You can also close the connection, without any reconnect, with `connection.close()`.

#### Events

The `Connection` object implements three events related to the reconnecting logic.

| Event           | Data       | Description                                                                                              |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| ready           | -          | Fired when authentication is successful and the connection is ready to take commands.                    |
| disconnected    | -          | Fired when the connection is lost.                                                                       |
| reconnect-error | Error code | Fired when we encounter a fatal error when trying to reconnect. Currently limited to `ERR_INVALID_AUTH`. |

You can attach and remove listeners as follows:

```javascript
function eventHandler(connection, data) {
  console.log("Connection has been established again");
}

conn.addEventListener("ready", eventHandler);
conn.removeEventListener("ready", eventHandler);
```

### Entities

You can subscribe to the entities of Home Assistant. Your callback will be called when the entities are first loaded and on every change to the state of any of the entities after that. The callback will be called with a single object that contains the entities keyed by entity_id.

The function `subscribeEntities` will return an unsubscribe function.

```javascript
import { subscribeEntities } from "home-assistant-js-websocket";

// conn is the connection from earlier.
subscribeEntities(conn, (entities) => console.log("New entities!", entities));
```

You can also import the collection:

```javascript
import { entitiesColl } from "home-assistant-js-websocket";

// conn is the connection from earlier.
const coll = entitiesColl(connection);
console.log(coll.state);
await coll.refresh();
coll.subscribe((entities) => console.log(entities));
```

### Config

You can subscribe to the config of Home Assistant. Config can change when either a component gets loaded.

The function `subscribeConfig` will return an unsubscribe function.

```javascript
import { subscribeConfig } from "home-assistant-js-websocket";

// conn is the connection from earlier.
subscribeConfig(conn, (config) => console.log("New config!", config));
```

You can also import the collection:

```javascript
import { configColl } from "home-assistant-js-websocket";

// conn is the connection from earlier.
const coll = configColl(connection);
console.log(coll.state);
await coll.refresh();
coll.subscribe((config) => console.log(config));
```

### Services

You can subscribe to the available services of Home Assistant. Services can change when a new service gets registered or removed.

The function `subscribeServices` will return an unsubscribe function.

```javascript
import { subscribeServices } from "home-assistant-js-websocket";

// conn is the connection from earlier.
subscribeServices(conn, (services) => console.log("New services!", services));
```

You can also import the collection:

```javascript
import { servicesColl } from "home-assistant-js-websocket";

// conn is the connection from earlier.
const coll = servicesColl(connection);
console.log(coll.state);
await coll.refresh();
coll.subscribe((services) => console.log(services));
```

### Collections

Besides entities, config and services you might want to create your own collections. A collection has the following features:

- Fetch a full data set on initial creation and on reconnect
- Subscribe to events to keep collection up to date
- Share subscription between multiple listeners
- Unsubscribe when no listeners
- Manually trigger a refresh

```typescript
// Will only initialize one collection per connection.
getCollection<State>(
  conn: Connection,
  key: string,
  fetchCollection: (conn: Connection) => Promise<State>,
  subscribeUpdates: (
    conn: Connection,
    store: Store<State>
  ) => Promise<UnsubscribeFunc>,
): Collection<State>

// Returns object with following type
class Collection<State> {
  state: State;
  async refresh(): Promise<void>;
  subscribe(subscriber: (state: State) => void): UnsubscribeFunc;
}
```

- `conn` is the connection to subscribe to.
- `key` a unique key for the collection
- `fetchCollection` needs to return a Promsise that resolves to the full state
- `subscribeUpdates` needs to subscribe to the updates and update the store. Returns a promise that resolves to an unsubscribe function.

#### Collection Example

```javascript
import { getCollection } from "home-assistant-js-websocket";

function panelRegistered(state, event) {
  // Returning null means no change.
  if (state === undefined) return null;

  // This will be merged with the existing state.
  return {
    panels: state.panels.concat(event.data.panel),
  };
}

const fetchPanels = (conn) => conn.sendMessagePromise({ type: "get_panels" });
const subscribeUpdates = (conn, store) =>
  conn.subscribeEvents(store.action(panelRegistered), "panel_registered");

const panelsColl = getCollection(conn, "_pnl", fetchPanels, subscribeUpdates);

// Now use collection
console.log(panelsColl.state);
await panelsColl.refresh();
panelsColl.subscribe((panels) => console.log("New panels!", panels));
```

Collections are useful to define if data is needed for initial data load. You can create a collection and have code on your page call it before you start rendering the UI. By the time UI is loaded, the data will be available to use.

## Connection API Reference

A connection object is obtained by calling [`createConnection()`](#createconnection).

##### `conn.haVersion`

String containing the current version of Home Assistant. Examples:

- `0.107.0`
- `0.107.0b1`
- `0.107.0.dev0`
- `2021.3.0`

##### `conn.subscribeEvents(eventCallback[, eventType])`

Subscribe to all or specific events on the Home Assistant bus. Calls `eventCallback` for each event that gets received.

Returns a promise that will resolve to a function that will cancel the subscription once called.

Subscription will be automatically re-established after a reconnect.

Uses `conn.subscribeMessage` under the hood.

##### `conn.addEventListener(eventType, listener)`

Listen for events on the connection. [See docs.](#automatic-reconnecting)

##### `conn.sendMessagePromise(message)`

Send a message to the server. Returns a promise that resolves or rejects based on the result of the server. Special case rejection is `ERR_CONNECTION_LOST` if the connection is lost while the command is in progress.

##### `conn.subscribeMessage(callback, subscribeMessage[, options])`

Call an endpoint in Home Assistant that creates a subscription. Calls `callback` for each item that gets received.

Returns a promise that will resolve to a function that will cancel the subscription once called.

Subscription will be automatically re-established after a reconnect unless `options.resubscribe` is false.

| Option      | Description                                     |
| ----------- | ----------------------------------------------- |
| resubscribe | Re-established a subscription after a reconnect |

## Auth API Reference

An instance of Auth is returned from the `getAuth` method. It has the following properties:

- `wsUrl`: the websocket url of the instance
- `accessToken`: the access token
- `expired`: boolean that indicates if the access token has expired

##### `auth.refreshAccessToken()`

Fetches a new access token from the server.

##### `auth.revoke()`

Makes a request to the server to revoke the refresh and all related access token. Returns a promise that resolves when the request is finished.

**Note:** If you support storing and retrieving tokens, the returned auth object might load tokens from your cache that are no longer valid. If this happens, the promise returned by `createConnection` will reject with `ERR_INVALID_AUTH`. If that happens, clear your tokens with `storeTokens(null`) and call `getAuth` again. This will pick up the auth flow without relying on stored tokens.

## Error Reference

| Error constant            | Error number |
| ------------------------- | ------------ |
| ERR_CANNOT_CONNECT        | 1            |
| ERR_INVALID_AUTH          | 2            |
| ERR_CONNECTION_LOST       | 3            |
| ERR_HASS_HOST_REQUIRED    | 4            |
| ERR_INVALID_HTTPS_TO_HTTP | 5            |

## Other methods

The library also contains a few helper method that you can use to ineract with the API.

- `getUser(connection) -> Promise<HassUser>`
- `callService(connection, domain, service, serviceData?, target?) -> Promise` (Support for `target` was added in Home Assistant Core 2021.3)

The following are also available, but it's recommended that you use the subscribe methods documented above.

- `getStates(connection) -> Promise<HassEntity[]>`
- `getServices(connection) -> Promise<HassEntity[]>`
- `getConfig(connection) -> Promise<HassEntity[]>`

## Using this with long-lived access tokens

If you are in a browser, you should prefer to use the `getAuth()` flow. This will use the more secure refresh/access token pair. If that is not possible, you can ask the user to create a long-lived access token.

You will need to create your own auth object if you want to use this library with a long-lived access token.

```js
import {
  Auth,
  createConnection,
  subscribeEntities,
  createLongLivedTokenAuth,
} from "home-assistant-js-websocket";

(async () => {
  const auth = createLongLivedTokenAuth(
    "http://localhost:8123",
    "YOUR ACCESS TOKEN",
  );

  const connection = await createConnection({ auth });
  subscribeEntities(connection, (entities) => console.log(entities));
})();
```

## Using this in NodeJS

NodeJS does not have a WebSocket client built-in, but there are some good ones on NPM. We recommend ws. The easiest way to enable WebSocket is to polyfill it into the global namespace.
Look at https://github.com/keesschollaart81/vscode-home-assistant/blob/master/src/language-service/src/home-assistant/socket.ts as an example using ws.

If using TypeScript, you will need to install `@types/ws` as well.

```js
globalThis.WebSocket = require("ws");
```

or in TypeScript:

```ts
const wnd = globalThis;
wnd.WebSocket = require("ws");
```
