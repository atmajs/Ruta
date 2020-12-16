import { log_error } from '../utils/log'
import { path_split } from '../utils/path'
import { query_deserialize } from '../utils/query'
import { rgx_aliasMatcher, rgx_parsePartWithRegExpAlias } from '../utils/rgx'

import { IRoutePathSegment, Route }from './Route'

export function route_parseDefinition(route: Route, definition: string) {

    let c = definition.charCodeAt(0);
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
            let start = 1,
                end = definition.length - 1
                ;
            if (definition.charCodeAt(definition.length - 1) !== 41) {
                // )
                log_error('parser - expect group closing');
                end++;
            }

            route.match = new RegExp(definition.substring(start, end));
            return;
    }
    let parts = definition.split('/'),
        search,
        searchIndex,
        i = 0,
        imax = parts.length,
        x,
        c0,
        index,
        c1;


    let last = parts[imax - 1];
    searchIndex = last.indexOf('?');
    if (searchIndex > (imax === 1 ? -1 : 0)) {
        // `?` cannt be at `0` position, when has url definition contains `path`
        search = last.substring(searchIndex + 1);
        parts[imax - 1] = last.substring(0, searchIndex);
    }

    let matcher = '',
        alias = null,
        strictCount = 0;

    let gettingMatcher = true,
        isOptional,
        isAlias,
        rgx;

    let array = route.path = [] as IRoutePathSegment[];

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
            log_error('Strict part found after optional', definition);
        // endif

        if (x === '*') {
            array.push({
                matcher: new AnyMatcher()
            });
            continue;
        }

        if (isOptional)
            gettingMatcher = false;

        let bracketIndex = x.indexOf('(');
        if (isAlias && bracketIndex !== -1) {
            let end = x.length - 1;
            if (x[end] !== ')')
                end += 1;

            rgx = new RegExp(rgx_aliasMatcher(x.substring(bracketIndex + 1, end)));
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
        let query = route.query = {};

        parts = search.split('&');

        i = -1;
        imax = parts.length;

        let key, value, str, eqIndex;
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
                value = new RegExp(rgx_aliasMatcher(value));
            }

            query[key] = value;
        }

        if (route.path.length === 0) {
            route.strict = false;
        }
    }
};

/**
 * path should be already matched by the route
 */
export function route_parsePath(route: Route, path: string) {

    let queryIndex = path.indexOf('?');

    let query = queryIndex === -1
        ? null
        : path.substring(queryIndex + 1);

    let current = {
        path: path,
        params: query == null
            ? {}
            : query_deserialize(query, '&')
    };

    if (route.query) {
        // ensura aliased queries, like ?:debugger(d|debug)
        for (let key in route.query) {

            if (key[0] === '?')
                key = key.substring(1);

            if (key[0] === ':') {
                let alias = rgx_parsePartWithRegExpAlias(key),
                    name = alias.alias;

                current.params[name] = getAliasedValue(current.params, alias.matcher);
            }
        }
    }

    if (queryIndex !== -1) {
        path = path.substring(0, queryIndex);
    }

    if (route.path != null) {

        let pathArr = path_split(path),
            routePath = route.path,
            routeLength = routePath.length,

            imax = pathArr.length,
            i = 0;

        for (; i < imax; i++) {
            let part = pathArr[i];
            let x = i < routeLength ? routePath[i] : null;
            if (x) {
                if (typeof x === 'string') {
                    continue;
                }
                if (x.alias) {
                    current.params[x.alias] = part;
                    continue;
                }
            }
        }
    }

    return current;
};


// = private

function getAliasedValue(obj, matcher) {
    for (let key in obj) {
        if (matcher.test(key))
            return obj[key];
    }
}

abstract class Matcher {
    constructor(public str?: string) { }
    abstract test(string): boolean;
}

class StrMatcher extends Matcher {
    test(x) {
        return x === this.str;
    }
};
class AnyMatcher extends Matcher {
    test(x) {
        return true;
    }
};
