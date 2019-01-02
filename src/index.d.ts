/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 */
interface FetchInitInterface extends Object {
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    headers?: any;
    body?: any;
    mode?: any;
    credentials?: any;
    cache?: any;
    redirect?: any;
    referrer?: any;
    referrerPolicy?: any;
    integrity?: any;
    keepalive?: any;
    signal?: any;
    charset?: string;
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
 */
interface Headers {
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Body
 */
interface Body {
    bodyUsed: boolean;
    body: any;
    arrayBuffer(): Promise<any>;
    blob(): Promise<any>;
    formData(): Promise<any>;
    json(): Promise<any>;
    text(): Promise<any>;
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export interface Response extends Body {
}
declare class Headers implements Headers {
    map: any;
    constructor(headers?: any);
    append(name: any, value: any): void;
    delete(name: any): void;
    get(name: any): any;
    has(name: any): any;
    set(name: any, value: any): void;
    forEach(callback: any, thisArg?: any): void;
    keys(): any;
    values(): any;
    entries(): any;
    [Symbol.iterator]: () => any;
}
export declare class Response implements Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    type: 'default' | 'error';
    readonly url: string;
    useFinalURL: boolean;
    readonly body: any;
    readonly bodyUsed: boolean;
    constructor(body: any, init?: any);
    clone(): Response;
    error(): Response;
    redirect(url: any, status: any): Response;
    arrayBuffer(): any;
    blob(): any;
    formData(): any;
    json(): any;
    text(): any;
}
export default function fetch(input: string, init?: FetchInitInterface): Promise<{}>;
export {};
