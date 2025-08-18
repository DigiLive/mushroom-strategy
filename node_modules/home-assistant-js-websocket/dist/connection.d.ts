import { ERR_CONNECTION_LOST } from "./errors.js";
import { MessageBase } from "./types.js";
import { HaWebSocket } from "./socket.js";
import type { Auth } from "./auth.js";
export type ConnectionOptions = {
    setupRetry: number;
    auth?: Auth;
    createSocket: (options: ConnectionOptions) => Promise<HaWebSocket>;
};
export type ConnectionEventListener = (conn: Connection, eventData?: any) => void;
type Events = "ready" | "disconnected" | "reconnect-error";
type SubscriptionUnsubscribe = () => Promise<void>;
interface SubscribeEventCommmandInFlight<T> {
    resolve: (result?: any) => void;
    reject: (err: any) => void;
    callback: (ev: T) => void;
    subscribe: (() => Promise<SubscriptionUnsubscribe>) | undefined;
    unsubscribe: SubscriptionUnsubscribe;
}
type CommandWithAnswerInFlight = {
    resolve: (result?: any) => void;
    reject: (err: any) => void;
};
type CommandInFlight = SubscribeEventCommmandInFlight<any> | CommandWithAnswerInFlight;
export declare class Connection {
    options: ConnectionOptions;
    commandId: number;
    commands: Map<number, CommandInFlight>;
    eventListeners: Map<string, ConnectionEventListener[]>;
    closeRequested: boolean;
    suspendReconnectPromise?: Promise<void>;
    oldSubscriptions?: Map<number, CommandInFlight>;
    _queuedMessages?: Array<{
        resolve: (value?: unknown) => unknown;
        reject?: (err: typeof ERR_CONNECTION_LOST) => unknown;
    }>;
    socket?: HaWebSocket;
    /**
     * Version string of the Home Assistant instance. Set to version of last connection while reconnecting.
     */
    haVersion: string;
    constructor(socket: HaWebSocket, options: ConnectionOptions);
    get connected(): boolean;
    private _setSocket;
    addEventListener(eventType: Events, callback: ConnectionEventListener): void;
    removeEventListener(eventType: Events, callback: ConnectionEventListener): void;
    fireEvent(eventType: Events, eventData?: any): void;
    suspendReconnectUntil(suspendPromise: Promise<void>): void;
    suspend(): void;
    /**
     * Reconnect the websocket connection.
     * @param force discard old socket instead of gracefully closing it.
     */
    reconnect(force?: boolean): void;
    close(): void;
    /**
     * Subscribe to a specific or all events.
     *
     * @param callback Callback  to be called when a new event fires
     * @param eventType
     * @returns promise that resolves to an unsubscribe function
     */
    subscribeEvents<EventType>(callback: (ev: EventType) => void, eventType?: string): Promise<SubscriptionUnsubscribe>;
    ping(): Promise<unknown>;
    sendMessage(message: MessageBase, commandId?: number): void;
    sendMessagePromise<Result>(message: MessageBase): Promise<Result>;
    /**
     * Call a websocket command that starts a subscription on the backend.
     *
     * @param message the message to start the subscription
     * @param callback the callback to be called when a new item arrives
     * @param [options.resubscribe] re-established a subscription after a reconnect. Defaults to true.
     * @returns promise that resolves to an unsubscribe function
     */
    subscribeMessage<Result>(callback: (result: Result) => void, subscribeMessage: MessageBase, options?: {
        resubscribe?: boolean;
        preCheck?: () => boolean | Promise<boolean>;
    }): Promise<SubscriptionUnsubscribe>;
    private _handleMessage;
    private _handleClose;
    private _genCmdId;
}
export {};
