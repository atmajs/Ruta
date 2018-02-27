
				// source ./templates/UMD.js
				(function(factory){
					
					var _name = 'ruta',
						_global = typeof window === 'undefined' ? global : window,
						_module = {
							exports: {}
						};
				
					factory(_module, _module.exports, _global);
				
					if (typeof define === 'function' && define.amd) {
				        define([], function () {
				        	return _module.exports;
				        });
				        return;
				    } 
				    if (typeof module === 'object' && module.exports) {
				    	module.exports = _module.exports;
				    	return;
				    }
				
					if (_name) {
						_global[_name] = _module.exports;
					}
				
				}(function(module, exports, global){
					var _src_api_utils = {};
var _src_emit_Hash = {};
var _src_emit_History = {};
var _src_emit_ILocationSource = {};
var _src_emit_Lifycycle = {};
var _src_emit_LocationEmitter = {};
var _src_emit_Memory = {};
var _src_emit_Stack = {};
var _src_globals = {};
var _src_mask_attr_anchor_dynamic = {};
var _src_options = {};
var _src_route_Route = {};
var _src_route_RouteCollection = {};
var _src_route_match = {};
var _src_route_route_utils = {};
var _src_ruta = {};
var _src_utils_log = {};
var _src_utils_navigation = {};
var _src_utils_obj = {};
var _src_utils_parts = {};
var _src_utils_path = {};
var _src_utils_query = {};
var _src_utils_rgx = {};

				// source ./templates/ModuleSimplified.js
				var _src_utils_log;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log_error() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.error.apply(console, ['Ruta'].concat(args));
}
exports.log_error = log_error;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_log) && isObject(module.exports)) {
						Object.assign(_src_utils_log, module.exports);
						return;
					}
					_src_utils_log = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_query;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = _src_utils_log;
function query_deserialize(query, delimiter) {
    if (delimiter == null)
        delimiter = '&';
    var obj = {}, parts = query.split(delimiter), i = 0, imax = parts.length, x, val;
    for (; i < imax; i++) {
        x = parts[i].split('=');
        val = x[1] == null
            ? ''
            : decode(x[1]);
        obj_setProperty(obj, x[0], val);
    }
    return obj;
}
exports.query_deserialize = query_deserialize;
;
function query_serialize(params, delimiter) {
    if (delimiter == null)
        delimiter = '&';
    var query = '', key, val;
    for (key in params) {
        val = params[key];
        if (val == null)
            continue;
        // serialize as flag
        if (typeof val === 'boolean')
            val = null;
        query = query + (query ? delimiter : '') + key;
        if (val /* unstrict */)
            query += '=' + encode(val);
    }
    return query;
}
exports.query_serialize = query_serialize;
;
// = private
function obj_setProperty(obj, property, value) {
    var chain = property.split('.'), imax = chain.length, i = -1, key;
    while (++i < imax - 1) {
        key = chain[i];
        if (obj[key] == null)
            obj[key] = {};
        obj = obj[key];
    }
    obj[chain[i]] = value;
}
function decode(str) {
    try {
        return decodeURIComponent(str);
    }
    catch (error) {
        log_1.log_error('decode:URI malformed');
        return '';
    }
}
function encode(str) {
    try {
        return encodeURIComponent(str);
    }
    catch (error) {
        log_1.log_error('encode:URI malformed');
        return '';
    }
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_query) && isObject(module.exports)) {
						Object.assign(_src_utils_query, module.exports);
						return;
					}
					_src_utils_query = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_parts;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = _src_utils_query;
var path_1 = _src_utils_path;
/**
 *	'/foo/bar?a=b' =>
 *	{ path: ['foo', 'bar'], query: { a: 'b' } }
 */
function parts_serialize(parts) {
    var path = path_1.path_join(parts.path);
    if (parts.query == null)
        return path;
    return path
        + '?'
        + query_1.query_serialize(parts.query, '&');
}
exports.parts_serialize = parts_serialize;
;
function parts_deserialize(url) {
    var query = url.indexOf('?'), path = query === -1
        ? url
        : url.substring(0, query);
    return {
        path: path_1.path_split(path),
        query: query === -1
            ? null
            : query_1.query_deserialize(url.substring(query + 1), '&')
    };
}
exports.parts_deserialize = parts_deserialize;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_parts) && isObject(module.exports)) {
						Object.assign(_src_utils_parts, module.exports);
						return;
					}
					_src_utils_parts = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_path;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = _src_utils_query;
var parts_1 = _src_utils_parts;
function path_normalize(str) {
    var length = str.length, i = 0, j = length - 1;
    for (; i < length; i++) {
        if (str[i] === '/')
            continue;
        break;
    }
    for (; j > i; j--) {
        if (str[j] === '/')
            continue;
        break;
    }
    return str.substring(i, j + 1);
}
exports.path_normalize = path_normalize;
;
function path_split(path) {
    path = path_normalize(path);
    return path === ''
        ? []
        : path.split('/');
}
exports.path_split = path_split;
;
function path_join(pathParts) {
    return '/' + pathParts.join('/');
}
exports.path_join = path_join;
;
function path_fromCLI(commands) {
    if (typeof commands === 'string')
        commands = cli_split(commands);
    var parts = cli_parseArguments(commands);
    return parts_1.parts_serialize(parts);
}
exports.path_fromCLI = path_fromCLI;
;
function path_getQuery(path) {
    var i = path.indexOf('?');
    if (i === -1)
        return null;
    var query = path.substring(i + 1);
    return query_1.query_deserialize(query, '&');
}
exports.path_getQuery = path_getQuery;
;
function path_setQuery(path, mix) {
    var query = typeof mix !== 'string'
        ? query_1.query_serialize(mix, '&')
        : mix;
    var i = path.indexOf('?');
    if (i !== -1) {
        path = path.substring(0, i);
    }
    return path + '?' + query;
}
exports.path_setQuery = path_setQuery;
;
// == private
function cli_split(string) {
    var args = string.trim().split(/\s+/);
    var imax = args.length, i = -1, c, arg;
    while (++i < imax) {
        arg = args[i];
        if (arg.length === 0)
            continue;
        c = arg[0];
        if (c !== '"' && c !== "'")
            continue;
        var start = i;
        for (; i < imax; i++) {
            arg = args[i];
            if (arg[arg.length - 1] === c) {
                var str = args
                    .splice(start, i - start + 1)
                    .join(' ')
                    .slice(1, -1);
                args.splice(start, 0, str);
                imax = args.length;
                break;
            }
        }
    }
    return args;
}
function cli_parseArguments(argv) {
    var imax = argv.length, i = 0, params = {}, args = [], key, val, x;
    for (; i < imax; i++) {
        x = argv[i];
        if (x[0] === '-') {
            key = x.replace(/^[\-]+/, '');
            if (i < imax - 1 && argv[i + 1][0] !== '-') {
                val = argv[i + 1];
                i++;
            }
            else {
                val = true;
            }
            params[key] = val;
            continue;
        }
        args.push(x);
    }
    return {
        path: args,
        query: params
    };
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_path) && isObject(module.exports)) {
						Object.assign(_src_utils_path, module.exports);
						return;
					}
					_src_utils_path = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_rgx;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = _src_utils_log;
function rgx_fromString(str, flags) {
    return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), flags);
}
exports.rgx_fromString = rgx_fromString;
;
/**
 *  Url part should be completely matched, so add ^...$ and create RegExp
 */
function rgx_aliasMatcher(str) {
    if (str[0] === '^')
        return new RegExp(str);
    var groups = str.split('|');
    for (var i = 0, imax = groups.length; i < imax; i++) {
        groups[i] = '^' + groups[i] + '$';
    }
    return new RegExp(groups.join('|'));
}
exports.rgx_aliasMatcher = rgx_aliasMatcher;
;
/**
 * :debugger(d|debug) => { alias: 'debugger', matcher: RegExp }
 */
function rgx_parsePartWithRegExpAlias(str) {
    var pStart = str.indexOf('('), pEnd = str.lastIndexOf(')');
    if (pStart === -1 || pEnd === -1) {
        log_1.log_error('Expected alias part with regexp', str);
        return null;
    }
    var rgx = str.substring(pStart + 1, pEnd);
    return {
        alias: str.substring(1, pStart),
        matcher: rgx_aliasMatcher(rgx)
    };
}
exports.rgx_parsePartWithRegExpAlias = rgx_parsePartWithRegExpAlias;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_rgx) && isObject(module.exports)) {
						Object.assign(_src_utils_rgx, module.exports);
						return;
					}
					_src_utils_rgx = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_route_route_utils;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = _src_utils_log;
var path_1 = _src_utils_path;
var query_1 = _src_utils_query;
var rgx_1 = _src_utils_rgx;
function route_parseDefinition(route, definition) {
    var c = definition.charCodeAt(0);
    switch (c) {
        case 33:
            // !
            route.strict = true;
            definition = definition.substring(1);
            break;
        case 94:
            // ^
            route.strict = false;
            definition = definition.substring(1);
            break;
        case 40:
            // (
            var start = 1, end = definition.length - 1;
            if (definition.charCodeAt(definition.length - 1) !== 41) {
                // )
                log_1.log_error('parser - expect group closing');
                end++;
            }
            route.match = new RegExp(definition.substring(start, end));
            return;
    }
    var parts = definition.split('/'), search, searchIndex, i = 0, imax = parts.length, x, c0, index, c1;
    var last = parts[imax - 1];
    searchIndex = last.indexOf('?');
    if (searchIndex > (imax === 1 ? -1 : 0)) {
        // `?` cannt be at `0` position, when has url definition contains `path`
        search = last.substring(searchIndex + 1);
        parts[imax - 1] = last.substring(0, searchIndex);
    }
    var matcher = '', alias = null, strictCount = 0;
    var gettingMatcher = true, isOptional, isAlias, rgx;
    var array = route.path = [];
    for (; i < imax; i++) {
        x = parts[i];
        if (x === '')
            continue;
        c0 = x.charCodeAt(0);
        c1 = x.charCodeAt(1);
        isOptional = c0 === 63; /* ? */
        isAlias = (isOptional ? c1 : c0) === 58; /* : */
        index = 0;
        if (isOptional)
            index++;
        if (isAlias)
            index++;
        if (index !== 0)
            x = x.substring(index);
        // if DEBUG
        if (!isOptional && !gettingMatcher)
            log_1.log_error('Strict part found after optional', definition);
        // endif
        if (x === '*') {
            array.push({
                matcher: new AnyMatcher()
            });
            continue;
        }
        if (isOptional)
            gettingMatcher = false;
        var bracketIndex = x.indexOf('(');
        if (isAlias && bracketIndex !== -1) {
            var end = x.length - 1;
            if (x[end] !== ')')
                end += 1;
            rgx = new RegExp(rgx_1.rgx_aliasMatcher(x.substring(bracketIndex + 1, end)));
            x = x.substring(0, bracketIndex);
        }
        if (!isOptional && !isAlias) {
            array.push(x);
            continue;
        }
        if (isAlias) {
            array.push({
                alias: x,
                matcher: rgx,
                optional: isOptional
            });
            continue;
        }
        if (isOptional) {
            array.push({
                matcher: new StrMatcher(x),
                optional: isOptional
            });
        }
    }
    if (search) {
        var query = route.query = {};
        parts = search.split('&');
        i = -1;
        imax = parts.length;
        var key, value, str, eqIndex;
        while (++i < imax) {
            str = parts[i];
            eqIndex = str.indexOf('=');
            if (eqIndex === -1) {
                query[str] = ''; // <empty string>
                continue;
            }
            key = str.substring(0, eqIndex);
            value = str.substring(eqIndex + 1);
            if (value.charCodeAt(0) === 40) {
                // (
                value = new RegExp(rgx_1.rgx_aliasMatcher(value));
            }
            query[key] = value;
        }
        if (route.path.length === 0) {
            route.strict = false;
        }
    }
}
exports.route_parseDefinition = route_parseDefinition;
;
/**
 * path should be already matched by the route
 */
function route_parsePath(route, path) {
    var queryIndex = path.indexOf('?'), query = queryIndex === -1
        ? null
        : path.substring(queryIndex + 1), current = {
        path: path,
        params: query == null
            ? {}
            : query_1.query_deserialize(query, '&')
    };
    if (route.query) {
        // ensura aliased queries, like ?:debugger(d|debug)
        for (var key in route.query) {
            if (key[0] === '?')
                key = key.substring(1);
            if (key[0] === ':') {
                var alias = rgx_1.rgx_parsePartWithRegExpAlias(key), name = alias.alias;
                current.params[name] = getAliasedValue(current.params, alias.matcher);
            }
        }
    }
    if (queryIndex !== -1) {
        path = path.substring(0, queryIndex);
    }
    if (route.path != null) {
        var pathArr = path_1.path_split(path), routePath = route.path, routeLength = routePath.length, imax = pathArr.length, i = 0, part, x;
        for (; i < imax; i++) {
            part = pathArr[i];
            x = i < routeLength ? routePath[i] : null;
            if (x) {
                if (typeof x === 'string')
                    continue;
                if (x.alias) {
                    current.params[x.alias] = part;
                    continue;
                }
            }
        }
    }
    return current;
}
exports.route_parsePath = route_parsePath;
;
// = private
function getAliasedValue(obj, matcher) {
    for (var key in obj) {
        if (matcher.test(key))
            return obj[key];
    }
}
var Matcher = (function () {
    function Matcher(str) {
        this.str = str;
    }
    return Matcher;
}());
var StrMatcher = (function (_super) {
    __extends(StrMatcher, _super);
    function StrMatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StrMatcher.prototype.test = function (x) {
        return x === this.str;
    };
    return StrMatcher;
}(Matcher));
;
var AnyMatcher = (function (_super) {
    __extends(AnyMatcher, _super);
    function AnyMatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnyMatcher.prototype.test = function (x) {
        return true;
    };
    return AnyMatcher;
}(Matcher));
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_route_route_utils) && isObject(module.exports)) {
						Object.assign(_src_route_route_utils, module.exports);
						return;
					}
					_src_route_route_utils = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_options;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
/**
 * define if routes like '/path' are strict by default,
 * or set explicit '!/path' - strict, '^/path' - not strict
 *
 * Strict means - like in regex start-end /^$/
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    isStrict: true
};
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_options) && isObject(module.exports)) {
						Object.assign(_src_options, module.exports);
						return;
					}
					_src_options = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_route_Route;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_utils_1 = _src_route_route_utils;
var options_1 = _src_options;
var Route = (function () {
    function Route(definition, value) {
        if (value === void 0) { value = null; }
        this.definition = definition;
        this.value = value;
        this.strict = options_1.default.isStrict;
        var def = definition;
        if (def.charCodeAt(0) === 36) {
            var i = def.indexOf(' ');
            this.method = def.substring(1, i).toUpperCase();
            def = def.substring(i + 1);
        }
        route_utils_1.route_parseDefinition(this, def);
    }
    return Route;
}());
exports.default = Route;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_route_Route) && isObject(module.exports)) {
						Object.assign(_src_route_Route, module.exports);
						return;
					}
					_src_route_Route = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_route_match;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parts_1 = _src_utils_parts;
var rgx_1 = _src_utils_rgx;
var route_utils_1 = _src_route_route_utils;
function route_match(url, routes, method) {
    if (method === void 0) { method = null; }
    var parts = parts_1.parts_deserialize(url), imax = routes.length, i = -1;
    while (++i < imax) {
        var route = routes[i];
        if (route_isMatch(parts, route, method)) {
            route.current = route_utils_1.route_parsePath(route, url);
            return route;
        }
    }
    return null;
}
exports.route_match = route_match;
;
function route_matchAll(url, routes, method) {
    var parts = parts_1.parts_deserialize(url), imax = routes.length, i = -1, out = [];
    while (++i < imax) {
        var route = routes[i];
        if (route_isMatch(parts, route, method)) {
            route.current = route_utils_1.route_parsePath(route, url);
            out.push(route);
        }
    }
    return out;
}
exports.route_matchAll = route_matchAll;
;
function route_isMatch(parts, route, currentMethod) {
    if (currentMethod === void 0) { currentMethod = null; }
    if (currentMethod != null &&
        route.method != null &&
        route.method !== currentMethod) {
        return false;
    }
    if (route.match) {
        return route.match.test(typeof parts === 'string'
            ? parts
            : parts_1.parts_serialize(parts));
    }
    if (typeof parts === 'string')
        parts = parts_1.parts_deserialize(parts);
    // route defines some query, match these with the current path{parts}
    if (route.query) {
        var query = parts.query, key, value;
        if (query == null)
            return false;
        for (key in route.query) {
            value = route.query[key];
            var c = key[0];
            if (c === ':') {
                // '?:isGlob(g|glob) will match if any is present
                var alias = rgx_1.rgx_parsePartWithRegExpAlias(key);
                if (alias == null || hasKey(query, alias.matcher) === false)
                    return false;
                continue;
            }
            if (c === '?')
                continue;
            if (typeof value === 'string') {
                if (query[key] == null)
                    return false;
                if (value && query[key] !== value)
                    return false;
                continue;
            }
            if (value.test && !value.test(query[key]))
                return false;
        }
    }
    var routePath = route.path, routeLength = routePath.length;
    if (routeLength === 0) {
        if (route.strict)
            return parts.path.length === 0;
        return true;
    }
    var arr = parts.path;
    for (var i = 0, x, imax = arr.length; i < imax; i++) {
        x = routePath[i];
        if (i >= routeLength)
            return route.strict !== true;
        if (typeof x === 'string') {
            if (arr[i] === x)
                continue;
            return false;
        }
        if (x.matcher) {
            if (x.matcher.test(arr[i]) === false)
                return false;
            continue;
        }
        if (x.optional) {
            return true;
        }
        if (x.alias) {
            continue;
        }
        return false;
    }
    if (i < routeLength)
        return routePath[i].optional === true;
    return true;
}
exports.route_isMatch = route_isMatch;
;
function hasKey(obj, rgx) {
    for (var key in obj) {
        if (rgx.test(key))
            return true;
    }
    return false;
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_route_match) && isObject(module.exports)) {
						Object.assign(_src_route_match, module.exports);
						return;
					}
					_src_route_match = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_route_RouteCollection;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = _src_route_Route;
var match_1 = _src_route_match;
var route_utils_1 = _src_route_route_utils;
var RouteCollection = (function () {
    function RouteCollection() {
        this.routes = [];
    }
    /** alias for `push` */
    RouteCollection.prototype.add = function (def, value) {
        this.push(def, value);
        return this;
    };
    RouteCollection.prototype.push = function (def, value) {
        this.routes.push(new Route_1.default(def, value));
        return this;
    };
    RouteCollection.prototype.unshift = function (def, value) {
        var route = new Route_1.default(def, value);
        this.routes.unshift(route);
        return this;
    };
    RouteCollection.prototype.remove = function (def, value) {
        var imax = this.routes.length, i = -1;
        while (++i < imax) {
            var route = this.routes[i];
            if (def == null || route.definition !== def) {
                continue;
            }
            if (value == null || route.value !== value) {
                continue;
            }
            this.routes.splice(i, 1);
            i--;
            imax--;
        }
    };
    RouteCollection.prototype.get = function (path, method) {
        return match_1.route_match(path, this.routes, method);
    };
    RouteCollection.prototype.getAll = function (path, method) {
        return match_1.route_matchAll(path, this.routes, method);
    };
    RouteCollection.prototype.clear = function () {
        this.routes.length = 0;
        return this;
    };
    RouteCollection.parse = function (definition, path) {
        var route = {};
        route_utils_1.route_parseDefinition(route, definition);
        return route_utils_1.route_parsePath(route, path);
    };
    return RouteCollection;
}());
exports.default = RouteCollection;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_route_RouteCollection) && isObject(module.exports)) {
						Object.assign(_src_route_RouteCollection, module.exports);
						return;
					}
					_src_route_RouteCollection = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_Hash;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashEmitter = (function () {
    function HashEmitter(listener) {
        this.listener = listener;
        this.opts = null;
        window.onhashchange = this.onhashchange.bind(this);
    }
    HashEmitter.supports = function () {
        if (typeof window === 'undefined' || 'onhashchange' in window === false)
            return false;
        return true;
    };
    HashEmitter.normalizeHash = function (hash) {
        return hash.replace(/^[!#/]+/, '/');
    };
    HashEmitter.prototype.onhashchange = function () {
        this.changed();
    };
    HashEmitter.prototype.navigate = function (hash, opts) {
        this.opts = opts;
        if (hash == null) {
            this.changed();
            return;
        }
        location.hash = hash;
    };
    HashEmitter.prototype.changed = function (opts_) {
        var opts = opts_ || this.opts;
        this.opts = null;
        this.listener.onChanged(this.current(), opts);
    };
    HashEmitter.prototype.current = function () {
        return HashEmitter.normalizeHash(location.hash);
    };
    HashEmitter.prototype.back = function () {
        window.history.back();
    };
    HashEmitter.prototype.forward = function () {
        window.history.forward();
    };
    return HashEmitter;
}());
exports.default = HashEmitter;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_Hash) && isObject(module.exports)) {
						Object.assign(_src_emit_Hash, module.exports);
						return;
					}
					_src_emit_Hash = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_Lifycycle;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = _src_route_Route;
var match_1 = _src_route_match;
var Lifecycle = (function () {
    function Lifecycle(location, definition, callback) {
        this.location = location;
        this.definition = definition;
        this.callback = callback;
        this.changed = this.changed.bind(this);
        this.location.on('^/', this.changed);
        this.route = new Route_1.default(definition);
        var current = match_1.route_match(this.location.currentPath(), [this.route]);
        this.state = {
            type: EventType.Initial,
            direction: Direction.Forward,
            route: current
        };
        this.callback(this.state);
    }
    Lifecycle.prototype.changed = function (route, opts) {
        this.state.direction = opts.step < 0
            ? Direction.Back
            : Direction.Forward;
        var state = this.state;
        var current = match_1.route_match(this.location.currentPath(), [this.route]);
        if (current == null) {
            if (this.state.route == null) {
                return;
            }
            state.type = EventType.Leave;
            state.route = null;
            this.callback(state);
            return;
        }
        if (this.state.route == null) {
            state.type = EventType.Enter;
            state.route = current;
            this.callback(state);
            return;
        }
        state.type = EventType.Change;
        state.route = current;
        this.callback(state);
    };
    Lifecycle.prototype.dispose = function () {
        this.location.off('^/', this.changed);
    };
    return Lifecycle;
}());
exports.default = Lifecycle;
var EventType;
(function (EventType) {
    EventType["Initial"] = "initial";
    EventType["Enter"] = "enter";
    EventType["Leave"] = "leave";
    EventType["Change"] = "change";
})(EventType = exports.EventType || (exports.EventType = {}));
;
var Direction;
(function (Direction) {
    Direction["Forward"] = "forward";
    Direction["Back"] = "back";
})(Direction = exports.Direction || (exports.Direction = {}));
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_Lifycycle) && isObject(module.exports)) {
						Object.assign(_src_emit_Lifycycle, module.exports);
						return;
					}
					_src_emit_Lifycycle = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_obj;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function obj_extend(a, b) {
    if (b == null)
        return a || {};
    if (a == null)
        return obj_create(b);
    for (var key in b) {
        a[key] = b[key];
    }
    return a;
}
exports.obj_extend = obj_extend;
;
function obj_default(a, b) {
    if (b == null)
        return a || {};
    if (a == null)
        return obj_create(b);
    for (var key in b) {
        if (a[key] == null) {
            a[key] = b[key];
        }
    }
    return a;
}
exports.obj_default = obj_default;
;
var obj_create = Object.create || function (x) {
    var Ctor = function () { };
    Ctor.prototype = x;
    return new Ctor;
};
exports.obj_create = obj_create;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_obj) && isObject(module.exports)) {
						Object.assign(_src_utils_obj, module.exports);
						return;
					}
					_src_utils_obj = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_ILocationSource;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocationNavigateOptions = (function () {
    function LocationNavigateOptions() {
        /**
         * History step. 1: Forward, 0: Replace Current, -1-(-n): Back
         * @default: 1
         * */
        this.step = 1;
        /**
         * Backcompat.
         * @deprecated Use `step:0`
         */
        this.replace = false;
        /** When true and query arguments are used, than navigation extends current query */
        this.extend = false;
        /** When false listeners are not notified */
        this.silent = false;
        /** Additional arguments which will be attached to the routes model params */
        this.params = null;
    }
    return LocationNavigateOptions;
}());
exports.LocationNavigateOptions = LocationNavigateOptions;
var LocationBackOptions = (function () {
    function LocationBackOptions() {
    }
    return LocationBackOptions;
}());
exports.LocationBackOptions = LocationBackOptions;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_ILocationSource) && isObject(module.exports)) {
						Object.assign(_src_emit_ILocationSource, module.exports);
						return;
					}
					_src_emit_ILocationSource = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_navigation;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getStep(opts) {
    if (opts == null)
        return 1;
    if (opts.replace === true)
        return 0;
    if (opts.step != null)
        return opts.step;
    return 1;
}
exports.getStep = getStep;
;
function setProperty(opts, key, val) {
    var x = opts || {};
    x[key] = val;
    return x;
}
exports.setProperty = setProperty;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_navigation) && isObject(module.exports)) {
						Object.assign(_src_utils_navigation, module.exports);
						return;
					}
					_src_utils_navigation = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_Stack;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stack;
(function (Stack) {
    var uuid = 1;
    Stack.backStates = [];
    Stack.forwardStates = [];
    function create(url) {
        return {
            id: ++uuid,
            url: url
        };
    }
    Stack.create = create;
    function push(x) {
        Stack.backStates.push(x);
        Stack.forwardStates.length = 0;
    }
    Stack.push = push;
    function replace(x) {
        Stack.backStates[Math.max(0, Stack.backStates.length - 1)] = x;
    }
    Stack.replace = replace;
    function last() {
        return Stack.backStates.length === 0
            ? null
            : Stack.backStates[Stack.backStates.length - 1];
    }
    Stack.last = last;
    function next() {
        return Stack.forwardStates[0];
    }
    Stack.next = next;
    function isLast(id) {
        var x = last();
        return id != null && x != null && x.id === id;
    }
    Stack.isLast = isLast;
    function isNext(id) {
        var x = next();
        return id != null && x != null && x.id === id;
    }
    Stack.isNext = isNext;
    function pop() {
        return Stack.backStates.pop();
    }
    Stack.pop = pop;
    function setForward(state) {
        Stack.forwardStates.unshift(state);
    }
    Stack.setForward = setForward;
    function goForward() {
        Stack.backStates.push(Stack.forwardStates.shift());
    }
    Stack.goForward = goForward;
    function hasBack() {
        return Stack.backStates.length > 0;
    }
    Stack.hasBack = hasBack;
    function hasForwad() {
        return Stack.forwardStates.length > 0;
    }
    Stack.hasForwad = hasForwad;
})(Stack = exports.Stack || (exports.Stack = {}));
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_Stack) && isObject(module.exports)) {
						Object.assign(_src_emit_Stack, module.exports);
						return;
					}
					_src_emit_Stack = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_History;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lifycycle_1 = _src_emit_Lifycycle;
var obj_1 = _src_utils_obj;
var path_1 = _src_utils_path;
var ILocationSource_1 = _src_emit_ILocationSource;
var navigation_1 = _src_utils_navigation;
var Stack_1 = _src_emit_Stack;
var HistoryEmitter = (function () {
    function HistoryEmitter(listener) {
        this.listener = listener;
        this.initial = location.href;
        window.onpopstate = this.onpopstate.bind(this);
    }
    HistoryEmitter.supports = function () {
        if (typeof window === 'undefined')
            return false;
        if (!(window.history && window.history.pushState))
            return false;
        if (window.location.href !== document.baseURI) {
            return false;
        }
        return true;
    };
    HistoryEmitter.prototype.navigate = function (mix, opts) {
        if (opts === void 0) { opts = new ILocationSource_1.LocationNavigateOptions; }
        if (mix == null) {
            this.changed(opts);
            return;
        }
        var isQueryObject = typeof mix === 'object', url = null;
        if (opts.extend === true) {
            var query = isQueryObject ? mix : path_1.path_getQuery(mix), current = path_1.path_getQuery(location.search);
            if (current != null && query != null) {
                for (var key in current) {
                    // strict compare
                    if (query[key] !== void 0 && query[key] === null) {
                        delete current[key];
                    }
                }
                query = obj_1.obj_extend(current, query);
                url = path_1.path_setQuery(url || '', query);
            }
        }
        if (url == null) {
            url = isQueryObject ? path_1.path_setQuery('', mix) : mix;
        }
        var state = Stack_1.Stack.create(this.current());
        var direction = Lifycycle_1.Direction.Forward;
        var step = navigation_1.getStep(opts);
        if (step === 0) {
            history.replaceState(state, null, url);
            Stack_1.Stack.replace(state);
        }
        else {
            history.pushState(state, null, url);
            Stack_1.Stack.push(state);
        }
        opts.step = 1;
        this.initial = null;
        this.changed(opts);
    };
    HistoryEmitter.prototype.current = function () {
        return location.pathname + location.search;
    };
    HistoryEmitter.prototype.back = function () {
        window.history.back();
    };
    HistoryEmitter.prototype.forward = function () {
        window.history.forward();
    };
    HistoryEmitter.prototype.onpopstate = function (e) {
        if (this.initial === location.href) {
            this.initial = null;
            return;
        }
        var id = e.state && e.state.id;
        var isLast = Stack_1.Stack.isLast(id);
        var direction = Lifycycle_1.Direction.Back;
        if (isLast) {
            Stack_1.Stack.setForward(Stack_1.Stack.pop());
        }
        else if (Stack_1.Stack.isNext(id)) {
            Stack_1.Stack.goForward();
            direction = Lifycycle_1.Direction.Forward;
        }
        var opts = new ILocationSource_1.LocationNavigateOptions();
        opts.step = direction === Lifycycle_1.Direction.Back ? -1 : 1;
        this.changed(opts);
    };
    HistoryEmitter.prototype.changed = function (opts) {
        this.listener.onChanged(this.current(), opts);
    };
    return HistoryEmitter;
}());
exports.default = HistoryEmitter;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_History) && isObject(module.exports)) {
						Object.assign(_src_emit_History, module.exports);
						return;
					}
					_src_emit_History = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_Memory;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var navigation_1 = _src_utils_navigation;
var ILocationSource_1 = _src_emit_ILocationSource;
var MemoryEmitter = (function () {
    function MemoryEmitter(listener) {
        this.listener = listener;
        this.stack = ['/'];
        this.forwardStack = [];
    }
    MemoryEmitter.prototype.navigate = function (path, opts) {
        var step = navigation_1.getStep(opts);
        if (step < 1) {
            var arr = this.stack.splice(step - 1);
            (_a = this.forwardStack).unshift.apply(_a, arr);
        }
        else {
            this.forwardStack.length = 0;
        }
        this.stack.push(path);
        this.listener.onChanged(path, opts);
        var _a;
    };
    MemoryEmitter.prototype.current = function () {
        return this.stack[this.stack.length - 1];
    };
    MemoryEmitter.prototype.back = function () {
        this.forwardStack.unshift(this.stack.pop());
        var opts = new ILocationSource_1.LocationNavigateOptions();
        opts.step = -1;
        this.listener.onChanged(this.current(), opts);
    };
    MemoryEmitter.prototype.forward = function () {
        this.stack.push(this.forwardStack.shift());
        var opts = new ILocationSource_1.LocationNavigateOptions();
        opts.step = 1;
        this.listener.onChanged(this.current(), opts);
    };
    return MemoryEmitter;
}());
exports.default = MemoryEmitter;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_Memory) && isObject(module.exports)) {
						Object.assign(_src_emit_Memory, module.exports);
						return;
					}
					_src_emit_Memory = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_emit_LocationEmitter;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteCollection_1 = _src_route_RouteCollection;
var Hash_1 = _src_emit_Hash;
var History_1 = _src_emit_History;
var Memory_1 = _src_emit_Memory;
var log_1 = _src_utils_log;
var obj_1 = _src_utils_obj;
var ILocationSource_1 = _src_emit_ILocationSource;
var Lifycycle_1 = _src_emit_Lifycycle;
var Stack_1 = _src_emit_Stack;
var LocationEmitter = (function () {
    function LocationEmitter(collection, type) {
        if (collection === void 0) { collection = new RouteCollection_1.default(); }
        if (type === void 0) { type = null; }
        this.collection = collection;
        this.type = type;
        this.listeners = new RouteCollection_1.default();
        this.lifecycles = [];
        if (type == null) {
            if (History_1.default.supports()) {
                type = 'history';
            }
            else if (Hash_1.default.supports()) {
                type = 'hash';
            }
        }
        switch (type) {
            case 'hash':
                this.emitter = new Hash_1.default(this);
                break;
            case 'history':
                this.emitter = new History_1.default(this);
                break;
            case 'memory':
                this.emitter = new Memory_1.default(this);
                break;
        }
        if (this.emitter == null) {
            log_1.log_error('Router can not be initialized - (nor HistoryAPI / nor hashchange');
        }
    }
    LocationEmitter.prototype.onChanged = function (path, opts) {
        if (opts.silent === true) {
            return;
        }
        var route = this.collection.get(path);
        if (route) {
            this.doAction(route, opts);
        }
        var routes = this.listeners.getAll(path), imax = routes.length, i = -1;
        while (++i < imax) {
            this.doAction(routes[i], opts);
        }
    };
    LocationEmitter.prototype.doAction = function (route, opts) {
        if (typeof route.value === 'function') {
            var current = route.current;
            var params = current && current.params;
            if (opts && opts.params != null) {
                current.params = params = obj_1.obj_default(params, opts.params);
            }
            route.value(route, params);
        }
    };
    LocationEmitter.prototype.navigate = function (mix, opts) {
        if (opts === void 0) { opts = new ILocationSource_1.LocationNavigateOptions(); }
        this.emitter.navigate(mix, opts);
    };
    LocationEmitter.prototype.back = function (opts) {
        if (Stack_1.Stack.hasBack()) {
            this.emitter.back();
            return;
        }
        if (opts != null && opts.default != null) {
            var navOptions = opts.default.opts || new ILocationSource_1.LocationNavigateOptions();
            navOptions.step = 0;
            this.navigate(opts.default.url, navOptions);
            return;
        }
    };
    LocationEmitter.prototype.forward = function () {
        if (Stack_1.Stack.hasForwad()) {
            this.emitter.forward();
        }
    };
    LocationEmitter.prototype.getBackStack = function () {
        return Stack_1.Stack.backStates;
    };
    LocationEmitter.prototype.getForwardStack = function () {
        return Stack_1.Stack.forwardStates;
    };
    LocationEmitter.prototype.current = function () {
        return this.collection.get(this.currentPath());
    };
    LocationEmitter.prototype.currentPath = function () {
        return this.emitter.current();
    };
    LocationEmitter.prototype.on = function (def, cb) {
        this.listeners.push(def, cb);
    };
    LocationEmitter.prototype.off = function (def, cb) {
        this.listeners.remove(def, cb);
    };
    LocationEmitter.prototype.onLifecycle = function (def, cb) {
        this.lifecycles.push(new Lifycycle_1.default(this, def, cb));
    };
    LocationEmitter.prototype.offLifecycle = function (def, cb) {
        for (var i = 0; i < this.lifecycles.length; i++) {
            var x = this.lifecycles[i];
            if (x.definition === def && x.callback === cb) {
                x.dispose();
                this.lifecycles.splice(i, 1);
                i--;
            }
        }
    };
    return LocationEmitter;
}());
exports.default = LocationEmitter;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_emit_LocationEmitter) && isObject(module.exports)) {
						Object.assign(_src_emit_LocationEmitter, module.exports);
						return;
					}
					_src_emit_LocationEmitter = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_api_utils;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = _src_utils_path;
var query_1 = _src_utils_query;
exports.default = {
    /**
     * Format URI path from CLI command:
     * some action -foo bar === /some/action?foo=bar
     */
    pathFromCLI: path_1.path_fromCLI,
    query: {
        serialize: query_1.query_serialize,
        deserialize: query_1.query_deserialize,
        get: function (path_) {
            var path = path_ == null
                ? location.search
                : path_;
            return path_1.path_getQuery(path);
        }
    }
};
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_api_utils) && isObject(module.exports)) {
						Object.assign(_src_api_utils, module.exports);
						return;
					}
					_src_api_utils = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_globals;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mask_;
exports.mask = mask_;
if (typeof mask !== 'undefined') {
    exports.mask = mask_ = mask;
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_globals) && isObject(module.exports)) {
						Object.assign(_src_globals, module.exports);
						return;
					}
					_src_globals = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_mask_attr_anchor_dynamic;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = _src_globals;
var ruta_1 = _src_ruta;
if (globals_1.mask) {
    globals_1.mask.registerAttrHandler('x-dynamic', function (node, value, model, ctx, tag) {
        tag.onclick = navigate;
    }, 'client');
}
function navigate(event) {
    event.preventDefault();
    event.stopPropagation();
    ruta_1.default.navigate(this.getAttribute('href'));
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_mask_attr_anchor_dynamic) && isObject(module.exports)) {
						Object.assign(_src_mask_attr_anchor_dynamic, module.exports);
						return;
					}
					_src_mask_attr_anchor_dynamic = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_ruta;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteCollection_1 = _src_route_RouteCollection;
var LocationEmitter_1 = _src_emit_LocationEmitter;
var utils_1 = _src_api_utils;
var options_1 = _src_options;
_src_mask_attr_anchor_dynamic;
var routes = new RouteCollection_1.default(), router;
function router_ensure() {
    if (router == null)
        router = new LocationEmitter_1.default(routes);
    return router;
}
exports.default = {
    Collection: RouteCollection_1.default,
    setRouterType: function (type) {
        if (router == null) {
            router = new LocationEmitter_1.default(routes, type);
        }
        return this;
    },
    setStrictBehaviour: function (isStrict) {
        options_1.default.isStrict = isStrict;
        return this;
    },
    add: function (regpath, mix) {
        router_ensure();
        routes.add(regpath, mix);
        return this;
    },
    on: function (regpath, mix) {
        router_ensure().on(regpath, mix);
        return this;
    },
    off: function (regpath, mix) {
        router_ensure().off(regpath, mix);
        return this;
    },
    onLifecycle: function (def, cb) {
        router_ensure().onLifecycle(def, cb);
        return this;
    },
    offLifecycle: function (def, cb) {
        router_ensure().offLifecycle(def, cb);
        return this;
    },
    get: function (path) {
        if (router != null && router.type === 'hash' && path.indexOf('#') !== -1) {
            path = path.substr(path.indexOf('#') + 1);
        }
        return routes.get(path);
    },
    navigate: function (mix, opts) {
        router_ensure().navigate(mix, opts);
        return this;
    },
    back: function (opts) {
        return router_ensure().back(opts);
    },
    forward: function () {
        return router_ensure().forward();
    },
    current: function () {
        return router_ensure().current();
    },
    currentPath: function () {
        return router_ensure().currentPath();
    },
    getBackStack: function () {
        return router_ensure().getBackStack();
    },
    getForwardStack: function () {
        return router_ensure().getForwardStack();
    },
    notifyCurrent: function () {
        router_ensure().navigate();
        return this;
    },
    parse: RouteCollection_1.default.parse,
    /*
     * @deprecated - use `_` instead
     */
    $utils: utils_1.default,
    _: utils_1.default,
};
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_ruta) && isObject(module.exports)) {
						Object.assign(_src_ruta, module.exports);
						return;
					}
					_src_ruta = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
"use strict";
var ruta_1 = _src_ruta;
module.exports = ruta_1.default;

				}));
				// end:source ./templates/UMD.js
				