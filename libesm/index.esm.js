var _a;
function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
}
function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value);
    }
    return value;
}
// Build a destructive iterator for the value list
function iteratorFor(items) {
    let iterator = {
        next() {
            let value = items.shift();
            return { done: value === undefined, value: value };
        }
    };
    iterator[Symbol.iterator] = () => {
        return iterator;
    };
    return iterator;
}
class Headers {
    constructor(headers) {
        this[_a] = this.entries;
        this.map = {};
        if (headers instanceof Headers) {
            headers.forEach((value, name) => {
                this.append(name, value);
            }, this);
        }
        else if (Array.isArray(headers)) {
            headers.forEach((header) => {
                this.append(header[0], header[1]);
            }, this);
        }
        else if (headers) {
            Object.getOwnPropertyNames(headers).forEach((name) => {
                this.append(name, headers[name]);
            }, this);
        }
    }
    append(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        let oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
    }
    delete(name) {
        delete this.map[normalizeName(name)];
    }
    get(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
    }
    has(name) {
        return this.map.hasOwnProperty(normalizeName(name));
    }
    set(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
    }
    forEach(callback, thisArg) {
        for (let name in this.map) {
            if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
            }
        }
    }
    keys() {
        let items = [];
        // @ts-ignore
        this.forEach((value, name) => {
            items.push(name);
        });
        return iteratorFor(items);
    }
    values() {
        let items = [];
        this.forEach((value) => {
            items.push(value);
        });
        return iteratorFor(items);
    }
    entries() {
        let items = [];
        this.forEach((value, name) => {
            items.push([name, value]);
        });
        return iteratorFor(items);
    }
}
_a = Symbol.iterator;
let redirectStatuses = [301, 302, 303, 307, 308];
// body 不能重复读取
function consumed(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('Body has already been consumed.'));
    }
    body.bodyUsed = true;
}
class Response {
    constructor(body, init = {}) {
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
        response.type = 'error';
        return response;
    }
    redirect(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
        }
        return new Response(null, { status: status, headers: { location: url } });
    }
    arrayBuffer() {
        if (this.body instanceof ArrayBuffer) {
            return Promise.resolve(this.body);
        }
        return Promise.reject('Not Support');
    }
    buffer() {
        if (this.body instanceof ArrayBuffer) {
            return Promise.resolve(new Uint8Array(this.body));
        }
        return Promise.reject('Not Support');
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
        let rejected = consumed(this);
        if (rejected) {
            return rejected;
        }
        return Promise.resolve(this.body);
    }
}
function parseHeaders(rawHeaders) {
    let headers = new Headers();
    for (let key in rawHeaders) {
        headers.append(key, rawHeaders[key]);
    }
    return headers;
}
function fetch(input, init = {}) {
    return new Promise((resolve, reject) => {
        init.charset = init.charset || 'utf8';
        // @ts-ignore
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
                };
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

export default fetch;
