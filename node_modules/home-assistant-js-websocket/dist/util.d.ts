export declare function parseQuery<T>(queryString: string): T;
export declare const debounce: <T extends (...args: any[]) => unknown>(func: T, wait: number, immediate?: boolean) => T;
export declare const atLeastHaVersion: (version: string, major: number, minor: number, patch?: number) => boolean;
