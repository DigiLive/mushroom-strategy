export type AuthData = {
    hassUrl: string;
    clientId: string | null;
    expires: number;
    refresh_token: string;
    access_token: string;
    expires_in: number;
};
export type SaveTokensFunc = (data: AuthData | null) => void;
export type LoadTokensFunc = () => Promise<AuthData | null | undefined>;
export type getAuthOptions = {
    hassUrl?: string;
    clientId?: string | null;
    redirectUrl?: string;
    authCode?: string;
    saveTokens?: SaveTokensFunc;
    loadTokens?: LoadTokensFunc;
    limitHassInstance?: boolean;
};
export declare const genClientId: () => string;
export declare const genExpires: (expires_in: number) => number;
export declare class Auth {
    private _saveTokens?;
    data: AuthData;
    constructor(data: AuthData, saveTokens?: SaveTokensFunc);
    get wsUrl(): string;
    get accessToken(): string;
    get expired(): boolean;
    /**
     * Refresh the access token.
     */
    refreshAccessToken(): Promise<void>;
    /**
     * Revoke the refresh & access tokens.
     */
    revoke(): Promise<void>;
}
export declare function createLongLivedTokenAuth(hassUrl: string, access_token: string): Auth;
export declare function getAuth(options?: getAuthOptions): Promise<Auth>;
