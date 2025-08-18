export function auth(accessToken) {
    return {
        type: "auth",
        access_token: accessToken,
    };
}
export function supportedFeatures() {
    return {
        type: "supported_features",
        id: 1, // Always the first message after auth
        features: { coalesce_messages: 1 },
    };
}
export function states() {
    return {
        type: "get_states",
    };
}
export function config() {
    return {
        type: "get_config",
    };
}
export function services() {
    return {
        type: "get_services",
    };
}
export function user() {
    return {
        type: "auth/current_user",
    };
}
export function callService(domain, service, serviceData, target, returnResponse) {
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
export function subscribeEvents(eventType) {
    const message = {
        type: "subscribe_events",
    };
    if (eventType) {
        message.event_type = eventType;
    }
    return message;
}
export function unsubscribeEvents(subscription) {
    return {
        type: "unsubscribe_events",
        subscription,
    };
}
export function ping() {
    return {
        type: "ping",
    };
}
export function error(code, message) {
    return {
        type: "result",
        success: false,
        error: {
            code,
            message,
        },
    };
}
