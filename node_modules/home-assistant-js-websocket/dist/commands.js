import * as messages from "./messages.js";
export const getStates = (connection) => connection.sendMessagePromise(messages.states());
export const getServices = (connection) => connection.sendMessagePromise(messages.services());
export const getConfig = (connection) => connection.sendMessagePromise(messages.config());
export const getUser = (connection) => connection.sendMessagePromise(messages.user());
export const callService = (connection, domain, service, serviceData, target, returnResponse) => connection.sendMessagePromise(messages.callService(domain, service, serviceData, target, returnResponse));
