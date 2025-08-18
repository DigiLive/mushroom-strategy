import { UnsubscribeFunc } from "./types.js";
type Listener<State> = (state: State) => void;
type Action<State> = (state: State, ...args: any[]) => Partial<State> | Promise<Partial<State>> | null;
type BoundAction<State> = (...args: any[]) => void;
export type Store<State> = {
    state: State | undefined;
    action(action: Action<State>): BoundAction<State>;
    setState(update: Partial<State>, overwrite?: boolean): void;
    clearState(): void;
    subscribe(listener: Listener<State>): UnsubscribeFunc;
};
export declare const createStore: <State>(state?: State) => Store<State>;
export {};
