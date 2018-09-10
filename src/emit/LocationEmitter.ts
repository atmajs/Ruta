import RouteCollection from '../route/RouteCollection'
import HashEmitter from './Hash'
import HistoryEmitter from './History'
import MemoryEmitter from './Memory'
import { log_error } from '../utils/log'
import { obj_default } from '../utils/obj'
import { ILocationSource, LocationNavigateOptions, LocationBackOptions } from './ILocationSource'
import Lifecycle from './Lifycycle'
import { Stack, State } from './Stack';
import Route from '../route/Route';

export default class LocationEmitter {

	public listeners = new RouteCollection()
	public lifecycles: Lifecycle[] = []
	public emitter: ILocationSource	

	constructor (public collection: RouteCollection = new RouteCollection(), public type: 'hash' | 'history' | 'memory' = null) {

		if (type == null) {
			if (HistoryEmitter.supports()) {
				type = 'history';
			} else if (HashEmitter.supports()) {
				type = 'hash';
			} 
		}
		switch (type) {
			case 'hash':
				this.emitter = new HashEmitter(this);
				break;
			case 'history':
				this.emitter = new HistoryEmitter(this);
				break;
			case 'memory':
				this.emitter = new MemoryEmitter(this);
				break;
		}
		if (this.emitter == null) {
			log_error('Router can not be initialized - (nor HistoryAPI / nor hashchange');
		}
	}

	onChanged (path, opts: LocationNavigateOptions = null) {
		if (opts && opts.silent === true) {
			return;
		}

		let route = this.collection.get(path);
		if (route) {
			this.doAction(route, opts);
		}
		let routes = this.listeners.getAll(path),
			imax = routes.length,
			i = -1;
		while ( ++i < imax ) {
			this.doAction(routes[i], opts);			
		}
	}
	private doAction (route, opts: LocationNavigateOptions = null) {
		if (typeof route.value === 'function') {
			var current = route.current;
			var params = current && current.params;
			if (opts && opts.params != null) {
				current.params = params = obj_default(params, opts.params);
			}
			route.value(route, params);
		}
	}
	navigate (mix?, opts: LocationNavigateOptions = new LocationNavigateOptions()) {
		this.emitter.navigate(mix, opts);
	}
	back (opts?: LocationBackOptions) {
		if (Stack.hasBack()) {
			this.emitter.back();
			return;
		}
		if (opts != null && opts.default != null) {
			let navOptions = opts.default.opts || new LocationNavigateOptions();
			navOptions.step = 0;
			this.navigate(opts.default.url, navOptions);
			return;
		}
	}
	forward () {
		if (Stack.hasForwad()) {
			this.emitter.forward();
		}
	}
	getStack () {
		return Stack.stack;
	}
	getBackStack () {
		return Stack.getBackStack();
	}
	getForwardStack () {
		return Stack.forwardStates;
	}
	current (): Route {
		return this.collection.get(
			this.currentPath()
		);
	}
	currentPath () {
		return this.emitter.current();
	}
	on (def, cb) {
		this.listeners.push(def, cb);
	}
	off (def, cb) {
		this.listeners.remove(def, cb);
	}
	onLifecycle (def, cb) {
		this.lifecycles.push(new Lifecycle(this, def, cb));
	}
	offLifecycle (def, cb) {
		for(var i = 0; i < this.lifecycles.length; i++) {
			var x = this.lifecycles[i];
			if (x.definition === def && x.callback === cb) {
				x.dispose();
				this.lifecycles.splice(i, 1);
				i--;
			}
		}
	}
};
