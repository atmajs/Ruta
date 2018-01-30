// Generated by dts-bundle v0.7.3

declare module 'ruta' {
    import Ruta from 'ruta/ruta';
    export = Ruta;
}

declare module 'ruta/ruta' {
    import RouteCollection from 'ruta/route/RouteCollection';
    import './mask/attr/anchor-dynamic';
    import { ILifeCycleEvent } from 'ruta/emit/Lifycycle';
    import { LocationNavigateOptions, LocationBackOptions } from 'ruta/emit/ILocationSource';
    const _default: {
        Collection: typeof RouteCollection;
        setRouterType(type: any): any;
        setStrictBehaviour(isStrict: boolean): any;
        add(regpath: any, mix: any): any;
        on(regpath: any, mix: any): any;
        off(regpath: any, mix: any): any;
        onLifecycle(def: string, cb: (event: ILifeCycleEvent) => void): any;
        offLifecycle(def: string, cb: any): any;
        get(path: any): any;
        navigate(mix: any, opts?: LocationNavigateOptions): any;
        back(opts?: LocationBackOptions): void;
        forward(): void;
        current(): any;
        currentPath(): string;
        getBackStack(): any[];
        getForwardStack(): any[];
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

declare module 'ruta/emit/Lifycycle' {
    import LocationEmitter from 'ruta/emit/LocationEmitter';
    import Route from 'ruta/route/Route';
    import { LocationNavigateOptions } from 'ruta/emit/ILocationSource';
    export default class Lifecycle {
        location: LocationEmitter;
        definition: string;
        callback: (ILifeCycleEvent) => void;
        route: Route;
        state: ILifeCycleEvent;
        constructor(location: LocationEmitter, definition: string, callback: (ILifeCycleEvent) => void);
        changed(route: any, opts: LocationNavigateOptions): void;
        dispose(): void;
    }
    export enum EventType {
        Initial = "initial",
        Enter = "enter",
        Leave = "leave",
        Change = "change",
    }
    export enum Direction {
        Forward = "forward",
        Back = "back",
    }
    export interface ILifeCycleEvent {
        type: EventType;
        direction: Direction;
        route: Route;
    }
}

declare module 'ruta/emit/ILocationSource' {
    export class LocationNavigateOptions {
            /**
                * History step. 1: Forward, 0: Replace Current, -1-(-n): Back
                * @default: 1
                * */
            step?: number;
            /**
                * Backcompat.
                * @deprecated Use `step:0`
                */
            replace?: boolean;
            /** When true and query arguments are used, than navigation extends current query */
            extend?: boolean;
            /** When false listeners are not notified */
            silent?: boolean;
            /** Additional arguments which will be attached to the routes model params */
            params?: any;
    }
    export class LocationBackOptions {
            default?: {
                    url: string;
                    opts?: LocationNavigateOptions;
            };
    }
    export interface ILocationSource {
            navigate(path: object | string, opts?: LocationNavigateOptions): any;
            back(): any;
            forward(): any;
            current(): string;
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

declare module 'ruta/emit/LocationEmitter' {
    import RouteCollection from 'ruta/route/RouteCollection';
    import { ILocationSource, LocationNavigateOptions, LocationBackOptions } from 'ruta/emit/ILocationSource';
    import Lifecycle from 'ruta/emit/Lifycycle';
    export default class LocationEmitter {
        collection: RouteCollection;
        listeners: RouteCollection;
        lifecycles: Lifecycle[];
        emitter: ILocationSource;
        constructor(collection?: RouteCollection, type?: 'hash' | 'history' | 'memory');
        onChanged(path: any, opts: LocationNavigateOptions): void;
        navigate(mix?: any, opts?: LocationNavigateOptions): void;
        back(opts?: LocationBackOptions): void;
        forward(): void;
        getBackStack(): any[];
        getForwardStack(): any[];
        current(): any;
        currentPath(): string;
        on(def: any, cb: any): void;
        off(def: any, cb: any): void;
        onLifecycle(def: any, cb: any): void;
        offLifecycle(def: any, cb: any): void;
    }
}

