"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Request = /** @class */ (function () {
    function Request() {
    }
    // @ts-ignore
    Request.prototype.constructer = function (input, init) {
    };
    return Request;
}());
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
    var iterator = {
        next: function () {
            var value = items.shift();
            return { done: value === undefined, value: value };
        }
    };
    iterator[Symbol.iterator] = function () {
        return iterator;
    };
    return iterator;
}
var Headers = /** @class */ (function () {
    function Headers(headers) {
        var _this = this;
        this[Symbol.iterator] = this.entries;
        this.map = {};
        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                _this.append(name, value);
            }, this);
        }
        else if (Array.isArray(headers)) {
            headers.forEach(function (header) {
                _this.append(header[0], header[1]);
            }, this);
        }
        else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                _this.append(name, headers[name]);
            }, this);
        }
    }
    Headers.prototype.append = function (name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
    };
    Headers.prototype.delete = function (name) {
        delete this.map[normalizeName(name)];
    };
    Headers.prototype.get = function (name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
    };
    Headers.prototype.has = function (name) {
        return this.map.hasOwnProperty(normalizeName(name));
    };
    Headers.prototype.set = function (name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
    };
    Headers.prototype.forEach = function (callback, thisArg) {
        for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
            }
        }
    };
    Headers.prototype.keys = function () {
        var items = [];
        // @ts-ignore
        this.forEach(function (value, name) {
            items.push(name);
        });
        return iteratorFor(items);
    };
    Headers.prototype.values = function () {
        var items = [];
        this.forEach(function (value) {
            items.push(value);
        });
        return iteratorFor(items);
    };
    Headers.prototype.entries = function () {
        var items = [];
        this.forEach(function (value, name) {
            items.push([name, value]);
        });
        return iteratorFor(items);
    };
    return Headers;
}());
var redirectStatuses = [301, 302, 303, 307, 308];
// body 不能重复读取
function consumed(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('Body has already been consumed.'));
    }
    body.bodyUsed = true;
}
var Response = /** @class */ (function () {
    function Response(body, init) {
        if (init === void 0) { init = {}; }
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
    Response.prototype.clone = function () {
        return new Response(this.body, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        });
    };
    Response.prototype.error = function () {
        var response = new Response(null, { status: 0, statusText: '' });
        response.type = 'error';
        return response;
    };
    Response.prototype.redirect = function (url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
        }
        return new Response(null, { status: status, headers: { location: url } });
    };
    Response.prototype.arrayBuffer = function () {
        return this.text();
    };
    Response.prototype.blob = function () {
        return this.text();
    };
    Response.prototype.formData = function () {
        return this.text();
    };
    Response.prototype.json = function () {
        return this.text().then(JSON.parse);
    };
    Response.prototype.text = function () {
        var rejected = consumed(this);
        if (rejected) {
            return rejected;
        }
        return Promise.resolve(this.body);
    };
    return Response;
}());
exports.Response = Response;
function parseHeaders(rawHeaders) {
    var headers = new Headers();
    for (var key in rawHeaders) {
        headers.append(key, rawHeaders[key]);
    }
    return headers;
}
function fetch(input, init) {
    if (init === void 0) { init = {}; }
    new Request();
    return new Promise(function (resolve, reject) {
        init.charset = init.charset || 'utf8';
        wx.request({
            url: input,
            data: init.body || undefined,
            header: init.headers || undefined,
            method: init.method || 'GET',
            dataType: '其他',
            responseType: init.charset === 'utf8' ? 'text' : 'arraybuffer',
            success: function (res) {
                var options = {
                    status: res.statusCode,
                    statusText: 'OK',
                    headers: parseHeaders(res.header || ''),
                    url: input,
                };
                var body = res.data;
                resolve(new Response(body, options));
            },
            fail: function (e) {
                reject(e);
            },
            complete: function () {
            },
        });
    });
}
exports.default = fetch;
