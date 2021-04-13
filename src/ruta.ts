import { RouteCollection } from './route/RouteCollection'
import { LocationEmitter } from'./emit/LocationEmitter'
import ApiUtils from './api/utils'
import options from './options'
import './mask/attr/anchor-dynamic'
import { ILifeCycleEvent } from './emit/Lifycycle';
import { LocationNavigateOptions, LocationBackOptions } from './emit/ILocationSource';
import { Route }from './route/Route';
import { IState } from './emit/Stack'

let routes = new RouteCollection();
let router: LocationEmitter;

function router_ensure() {
    if (router == null) {
        router = new LocationEmitter(routes);
    }
    return router;
}

export { IState as State };

export const Ruta = {

    Collection: RouteCollection,
    Route: Route,

    setRouterType(type: 'hash' | 'history' | 'memory') {
        if (router == null) {
            router = new LocationEmitter(routes, type);
        }
        return this;
    },

    setStrictBehaviour(isStrict: boolean) {
        options.isStrict = isStrict;
        return this;
    },

    add(regpath, mix) {
        router_ensure();
        routes.add(regpath, mix);
        return this;
    },

    on(regpath, mix) {
        router_ensure().on(regpath, mix);
        return this;
    },
    off(regpath, mix) {
        router_ensure().off(regpath, mix);
        return this;
    },
    onLifecycle(def: string, cb: (event: ILifeCycleEvent) => void) {
        router_ensure().onLifecycle(def, cb);
        return this;
    },
    offLifecycle(def: string, cb: any) {
        router_ensure().offLifecycle(def, cb);
        return this;
    },

    get(path: string): Route {
        return routes.get(path);
    },
    navigate(mix, opts?: LocationNavigateOptions) {
        router_ensure().navigate(mix, opts);
        return this;
    },
    back(opts?: LocationBackOptions) {
        return router_ensure().back(opts);
    },
    forward() {
        return router_ensure().forward();
    },
    current() {
        return router_ensure().current();
    },
    currentPath() {
        return router_ensure().currentPath();
    },
    getStack() {
        return router_ensure().getStack();
    },
    getBackStack() {
        return router_ensure().getBackStack();
    },
    getForwardStack() {
        return router_ensure().getForwardStack();
    },
    notifyCurrent() {
        router_ensure().navigate();
        return this;
    },

    parse: RouteCollection.parse,

	/*
	 * @deprecated - use `_` instead
	 */
    $utils: ApiUtils,
    _: ApiUtils,
};
