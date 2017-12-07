import { Direction } from './Lifycycle'
import { obj_extend } from '../utils/obj'
import { path_getQuery, path_setQuery } from '../utils/path'
import { ILocationSource, LocationNavigateOptions } from './ILocationSource'
import LocationEmitter from './LocationEmitter'
import { getStep, setProperty } from '../utils/navigation'
import { Stack } from './Stack'


export default class HistoryEmitter implements ILocationSource {
	initial: string
	constructor(public listener: LocationEmitter) {
		this.initial = location.href;
		window.onpopstate = this.onpopstate.bind(this);
	}
	static supports() {
		if (typeof window === 'undefined')
			return false;

		if (!(window.history && window.history.pushState))
			return false;

		if (window.location.href !== document.baseURI) {
			return false;
		}
		return true;
	}	
	navigate(mix: object | string, opts: LocationNavigateOptions = new LocationNavigateOptions) {
		if (mix == null) {
			this.changed(opts);
			return;
		}
		var isQueryObject = typeof mix === 'object',
			url = null;
		if (opts.extend === true) {
			let query: any = isQueryObject ? mix : path_getQuery(mix as string),
				current = path_getQuery(location.search);

			if (current != null && query != null) {
				for (var key in current) {
					// strict compare
					if (query[key] !== void 0 && query[key] === null) {
						delete current[key];
					}
				}
				query = obj_extend(current, query);
				url = path_setQuery(url || '', query);
			}
		}
		if (url == null) {
			url = isQueryObject ? path_setQuery('', mix) : mix;
		}

		let state = Stack.create(this.current());
		let direction = Direction.Forward;
		let step = getStep(opts);		
		if (step === 0) {
			history.replaceState(state, null, url);
			Stack.push(state);
		} else {
			history.pushState(state, null, url);
			Stack.replace(state);
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
		let id = e.state && e.state.id;
		let isLast = Stack.isLast(id);
		let direction = Direction.Back;
		if (isLast) {
			Stack.setForward(Stack.pop());			
		} else if (Stack.isNext(id)) {
			Stack.goForward();
			direction = Direction.Forward;
		}
		let opts = new LocationNavigateOptions();
		opts.step = direction === Direction.Back ? -1 : 1;
		this.changed(opts);
	}
	private changed(opts: LocationNavigateOptions) {
		this.listener.onChanged(this.current(), opts);
	}
}
