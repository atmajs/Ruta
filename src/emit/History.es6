class HistoryEmitter {
	constructor (listener) {
		this.listener = listener;
		this.initial = location.href;
		window.onpopstate = this.onpopstate.bind(this);
	}
	static supports () {
		if (typeof window === 'undefined')
			return false;

		if (!(window.history && window.history.pushState))
			return false;

		if (window.location.href !== document.baseURI) {
			return false;
		}
		return true;
	}
	onpopstate () {
		if (this.initial === location.href) {
			this.initial = null;
			return;
		}
		this.changed();
	}
	navigate (mix, opts) {
		if (mix == null) {
			this.changed();
			return;
		}
		var isQueryObject = typeof mix === 'object',
			url = null;
		if (opts != null && opts.extend === true) {
			var query   = isQueryObject ? mix : path_getQuery(mix),
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

		if (opts && opts.replace === true) {
			history.replaceState({}, null, url);
		} else {
			history.pushState({}, null, url);
		}
		
		this.initial = null;
		this.changed(opts);
	}

	changed (opts) {
		this.listener.changed(this.current(), opts);
	}

	current () {
		return location.pathname + location.search;
	}
}
