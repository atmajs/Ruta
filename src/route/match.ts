import { parts_deserialize, parts_serialize, UrlSegments } from '../utils/parts'
import { rgx_parsePartWithRegExpAlias } from '../utils/rgx'
import { route_parsePath } from './route_utils'
import { Route }from './Route';

export function route_match(url: string, routes: Route[], method: string = null) {
    let parts = parts_deserialize(url);
    let imax = routes.length;
    let i = -1;
    while (++i < imax) {
        let route = routes[i];
        if (route_isMatch(parts, route, method)) {
            route.current = route_parsePath(route, url);
            return route;
        }
    }
    return null;
};
export function route_matchAll(url: string, routes: Route[], method: string = null) {
    let parts = parts_deserialize(url),
        imax = routes.length,
        i = -1, out = [];
    while (++i < imax) {
        let route = routes[i];
        if (route_isMatch(parts, route, method)) {
            route.current = route_parsePath(route, url);
            out.push(route);
        }
    }
    return out;
};

export function route_isMatch(parts: string | UrlSegments, route: Route, currentMethod: string = null) {

    if (currentMethod != null &&
        route.method != null &&
        route.method !== currentMethod) {
        return false;
    }

    if (route.match) {
        return route.match.test(
            typeof parts === 'string'
                ? parts
                : parts_serialize(parts)
        );
    }

    if (typeof parts === 'string') {
        parts = parts_deserialize(parts);
    }

    // route defines some query, match these with the current path{parts}
    if (route.query) {
        let query = parts.query;
        if (query == null) {
            return false;
        }

        for (let key in route.query) {
            let value = route.query[key];
            let c = key[0];
            if (c === ':') {
                // '?:isGlob(g|glob) will match if any is present
                let alias = rgx_parsePartWithRegExpAlias(key);
                if (alias == null || hasKey(query, alias.matcher) === false) {
                    return false;
                }
                continue;
            }

            if (c === '?') {
                continue;
            }

            if (typeof value === 'string') {

                if (query[key] == null) {
                    return false;
                }
                if (value && query[key] !== value) {
                    return false;
                }
                continue;
            }

            if (value.test && !value.test(query[key])) {
                return false;
            }
        }
    }

    let routePath = route.path;
    let routeLength = routePath.length;
    if (routeLength === 0) {
        if (route.strict) {
            return parts.path.length === 0;
        }
        return true;
    }


    let arr = parts.path;
    let i = 0;
    let imax = arr.length;
    for (; i < imax; i++) {

        let x = routePath[i];
        if (i >= routeLength) {
            return route.strict !== true;
        }

        if (typeof x === 'string') {
            if (arr[i] === x) {
                continue;
            }
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

    if (i < routeLength) {
        let x = routePath[i];
        return typeof x !== 'string' && x.optional === true;
    }


    return true;
};


function hasKey(obj, rgx) {

    for (let key in obj) {
        if (rgx.test(key))
            return true;
    }
    return false;
}

