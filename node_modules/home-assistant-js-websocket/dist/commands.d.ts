import { Connection } from "./connection.js";
import { HassEntity, HassServices, HassConfig, HassUser, HassServiceTarget } from "./types.js";
export declare const getStates: (connection: Connection) => Promise<HassEntity[]>;
export declare const getServices: (connection: Connection) => Promise<HassServices>;
export declare const getConfig: (connection: Connection) => Promise<HassConfig>;
export declare const getUser: (connection: Connection) => Promise<HassUser>;
export declare const callService: (connection: Connection, domain: string, service: string, serviceData?: object, target?: HassServiceTarget, returnResponse?: boolean) => Promise<unknown>;
