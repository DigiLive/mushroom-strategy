import { Error, HassServiceTarget } from "./types.js";
export declare function auth(accessToken: string): {
    type: string;
    access_token: string;
};
export declare function supportedFeatures(): {
    type: string;
    id: number;
    features: {
        coalesce_messages: number;
    };
};
export declare function states(): {
    type: string;
};
export declare function config(): {
    type: string;
};
export declare function services(): {
    type: string;
};
export declare function user(): {
    type: string;
};
type ServiceCallMessage = {
    type: "call_service";
    domain: string;
    service: string;
    service_data?: object;
    target?: HassServiceTarget;
    return_response?: boolean;
};
export declare function callService(domain: string, service: string, serviceData?: object, target?: HassServiceTarget, returnResponse?: boolean): ServiceCallMessage;
type SubscribeEventMessage = {
    type: "subscribe_events";
    event_type?: string;
};
export declare function subscribeEvents(eventType?: string): SubscribeEventMessage;
export declare function unsubscribeEvents(subscription: number): {
    type: string;
    subscription: number;
};
export declare function ping(): {
    type: string;
};
export declare function error(code: Error, message: string): {
    type: string;
    success: boolean;
    error: {
        code: Error;
        message: string;
    };
};
export {};
