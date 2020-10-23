import { obj_extend } from '../utils/obj'
import { path_getQuery, path_setQuery } from '../utils/path'
import { ILocationSource, LocationNavigateOptions } from './ILocationSource'
import LocationEmitter from './LocationEmitter'
import { getStep } from '../utils/navigation'
import { Stack } from './Stack'


export default class HistoryEmitter implements ILocationSource {
    initial: string
    constructor(public listener: LocationEmitter) {
        this.initial = location.href;
        window.onpopstate = this.onpopstate.bind(this);
        Stack.push(history.state || Stack.create(this.current()));
    }
    static supports() {
        if (typeof window === 'undefined') {
            return false;
        }
        if (!(window.history && window.history.pushState)) {
            return false;
        }
        return true;
    }
    navigate(mix: object | string, opts: LocationNavigateOptions = new LocationNavigateOptions) {
        if (mix == null) {
            this.changed(opts);
            return;
        }
        let isQueryObject = typeof mix === 'object';
        let url:string = null;
        if (opts.extend === true) {
            let query: any = isQueryObject ? mix : path_getQuery(mix as string);
            let current = path_getQuery(location.search);

            if (current != null && query != null) {
                for (var key in current) {
                    // strict compare
                    if (query[key] !== void 0 && query[key] === null) {
                        delete current[key];
                    }
                }
                query = obj_extend(current, query);
                url = path_setQuery(location.pathname, query);
            }
        }
        if (url == null) {
            url = isQueryObject ? path_setQuery(location.pathname, mix) : <string> mix;
        }

        let nextState = Stack.create(url);
        let step = getStep(opts);
        if (step === 0) {
            history.replaceState(nextState, null, url);
            Stack.replace(nextState);
        } else {
            history.pushState(nextState, null, url);
            Stack.push(nextState);
        }

        opts.step = 1;
        this.initial = null;
        this.changed(opts);
    }

    current() {
        return location.pathname + location.search;
    }
    back () {
        window.history.back();
    }
    forward () {
        window.history.forward();
    }

    private onpopstate(e: PopStateEvent) {
        if (this.initial === location.href) {
            this.initial = null;
            return;
        }
        this.initial = null;

        let step = -1;
        let id = e.state && e.state.id;
        if (id != null) {
            step = Stack.goBackById(id);
            if (step === 0) {
                step = Stack.goForwardById(id);
            }
        }
        if (step === 0) {
            if (e.state) {
                Stack.replace(e.state);
            }
            step = -1;
            Stack.goBackByCount(1);
        }

        let opts = new LocationNavigateOptions();

        opts.step = step;
        this.changed(opts);
    }
    private changed(opts: LocationNavigateOptions) {
        this.listener.onChanged(this.current(), opts);
    }
}
