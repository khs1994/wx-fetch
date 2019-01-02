/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 */
interface FetchInitInterface extends Object {
  method?:
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';
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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 */
interface Request extends Body {
  // @ts-ignore
  constructer(input, init): any;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export interface Response extends Body {

}

class Request implements Request {
  // @ts-ignore
  constructer(input, init) {

  }
}

function normalizeName(name: any) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value: any) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items: any) {
  let iterator: any = {
    next() {
      let value = items.shift()
      return { done: value === undefined, value: value }
    }
  }

  iterator[Symbol.iterator] = () => {
    return iterator
  }

  return iterator
}

class Headers implements Headers {
  public map: any;

  constructor(headers?: any) {

    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach((value: any, name: any) => {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach((header: any) => {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach((name: any) => {
        this.append(name, headers[name])
      }, this)
    }
  }

  append(name: any, value: any) {
    name = normalizeName(name)
    value = normalizeValue(value)
    let oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue + ', ' + value : value
  }

  delete(name: any) {
    delete this.map[normalizeName(name)]
  }

  get(name: any) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  has(name: any) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  set(name: any, value: any) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  forEach(callback: any, thisArg?: any) {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  keys() {
    let items: any = []
    // @ts-ignore
    this.forEach((value: any, name: any) => {
      items.push(name)
    })
    return iteratorFor(items)
  }

  values() {
    let items: any = []
    this.forEach((value: any) => {
      items.push(value)
    })
    return iteratorFor(items)
  }

  entries() {
    let items: any = []
    this.forEach((value: any, name: any) => {
      items.push([name, value])
    })
    return iteratorFor(items)
  }

  [Symbol.iterator] = this.entries;
}

let redirectStatuses = [301, 302, 303, 307, 308];

// body 不能重复读取
function consumed(body: any): any {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Body has already been consumed.'))
  }
  body.bodyUsed = true
}

export class Response implements Response {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  public type: 'default' | 'error';
  readonly url: string;
  public useFinalURL: boolean;

  readonly body: any;
  readonly bodyUsed: boolean;

  constructor(body: any, init: any = {}) {
    this.headers = new Headers(init.headers);
    this.redirected = false;
    this.status = init.status === undefined ? 200 : init.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'OK';
    this.type = 'default';
    this.bodyUsed = false;
    this.body = body;
    this.url = init.url;
    this.useFinalURL = true;
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  }

  error() {
    let response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error'
    return response
  }

  redirect(url: any, status: any) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, { status: status, headers: { location: url } })
  }

  arrayBuffer() {
    return this.text();
  }

  blob() {
    return this.text();
  }

  formData() {
    return this.text();
  }

  json() {
    return this.text().then(JSON.parse);
  }

  text() {
    let rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    return Promise.resolve(this.body);
  }
}

function parseHeaders(rawHeaders: any) {
  let headers = new Headers();

  for (let key in rawHeaders) {
    headers.append(key, rawHeaders[key]);
  }

  return headers
}

export default function fetch(input: string, init: FetchInitInterface = {}) {
  new Request();
  return new Promise((resolve, reject) => {
    init.charset = init.charset || 'utf8';

    wx.request({
      url: input,
      data: init.body || undefined,
      header: init.headers || undefined,
      method: init.method || 'GET',
      dataType: '其他',
      responseType: init.charset === 'utf8' ? 'text' : 'arraybuffer',
      success(res) {
        const options = {
          status: res.statusCode,
          statusText: 'OK',
          headers: parseHeaders(res.header || ''),
          url: input,
        }

        let body = res.data;

        resolve(new Response(body, options));
      },
      fail(e) {
        reject(e);
      },
      complete() {

      },
    });
  });
}
