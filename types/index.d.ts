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
export default function fetch(input: string, init?: FetchInitInterface): Promise<{}>;
export {};
