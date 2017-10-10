// Generated by dts-bundle v0.7.3

declare module 'ruta' {
    import Ruta from 'ruta/ruta';
    export = Ruta;
}

declare module 'ruta/ruta' {
    import RouteCollection from 'ruta/route/RouteCollection';
    import './mask/attr/anchor-dynamic';
    const _default: {
        Collection: typeof RouteCollection;
        setRouterType(type: any): any;
        setStrictBehaviour(isStrict: boolean): any;
        add(regpath: any, mix: any): any;
        on(regpath: any, mix: any): any;
        off(regpath: any, mix: any): any;
        onLifecycle(def: any, cb: any): any;
        offLifecycle(def: any, cb: any): any;
        get(path: any): any;
        navigate(mix: any, opts?: any): any;
        current(): any;
        currentPath(): string;
        notifyCurrent(): any;
        parse: (definition: any, path: any) => {
            path: any;
            params: {};
        };
        $utils: {
            pathFromCLI: (commands: any) => string;
            query: {
                serialize: (params: any, delimiter: any) => string;
                deserialize: (query: any, delimiter: any) => {};
                get: (path_: any) => {
                    [key: string]: string;
                };
            };
        };
        _: {
            pathFromCLI: (commands: any) => string;
            query: {
                serialize: (params: any, delimiter: any) => string;
                deserialize: (query: any, delimiter: any) => {};
                get: (path_: any) => {
                    [key: string]: string;
                };
            };
        };
    };
    export default _default;
}

declare module 'ruta/route/RouteCollection' {
    import Route from 'ruta/route/Route';
    export default class RouteCollection {
        routes: Route[];
        constructor();
        /** alias for `push` */
        add(def: string, value: any): this;
        push(def: string, value: any): this;
        unshift(def: string, value: any): this;
        remove(def: string, value: any): void;
        get(path: any, method?: any): any;
        getAll(path: any, method?: any): any[];
        clear(): this;
        static parse(definition: any, path: any): {
            path: any;
            params: {};
        };
    }
}

declare module 'ruta/route/Route' {
    export default class Route {
        definition: string;
        value: string | any;
        method: string;
        strict: boolean;
        current: any;
        query: {
            [key: string]: any;
        };
        path: string;
        constructor(definition: string, value?: string | any);
    }
}

