import {route_parseDefinition} from './route_utils'
import options from '../options'

export interface IRoutePathSegment {
    matcher: { test (str: string): boolean }
    alias?: string
    optional?: boolean
    isLookAhead?: boolean
}
export class Route {
    method: string
    strict: boolean = options.isStrict
    current: {
        value?: any
        path: string
        params: { [key: string]: any }
    }
    query: { [key: string]: string | RegExp }

    path: (string | IRoutePathSegment)[]

    match?: RegExp

    constructor (public definition?: string, public value: any = null) {
        if (definition == null) {
            return;
        }

        let def = definition;
        if (def.charCodeAt(0) === 36 /*$ method prefix, e.g.: $get path*/) {
            let i = def.indexOf(' ');
            this.method = def.substring(1, i).toUpperCase();
            def = def.substring(i + 1);
        }
        route_parseDefinition(this, def);
    }
};
