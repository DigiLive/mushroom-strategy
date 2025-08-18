// JS extensions in imports allow tsc output to be consumed by browsers.
import { createSocket } from "./socket.js";
import { Connection } from "./connection.js";
export * from "./auth.js";
export * from "./collection.js";
export * from "./connection.js";
export * from "./config.js";
export * from "./services.js";
export * from "./entities.js";
export * from "./errors.js";
export * from "./socket.js";
export * from "./types.js";
export * from "./commands.js";
export * from "./store.js";
export async function createConnection(options) {
    const connOptions = Object.assign({ setupRetry: 0, createSocket }, options);
    const socket = await connOptions.createSocket(connOptions);
    const conn = new Connection(socket, connOptions);
    return conn;
}
