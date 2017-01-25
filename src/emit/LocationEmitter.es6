class LocationEmitter {

	constructor (collection, type) {

		this.collection = collection || new Routes();
		this.listeners = new Routes();

		if (type) {
			var Constructor = type === 'hash'
				? HashEmitter
				: HistoryEmitter
				;
			this.emitter = new Constructor(this);
		}

		if (this.emitter == null && HistoryEmitter.supports())
			this.emitter = new HistoryEmitter(this);

		if (this.emitter == null && HashEmitter.supports())
			this.emitter = new HashEmitter(this);

		if (this.emitter == null) {
			log_error('Router can not be initialized - (nor HistoryAPI / nor hashchange');
		}
	}

	changed (path, opts) {
		if (opts && opts.silent === true) {
			return;
		}

		var route = this.collection.get(path);
		if (route) {
			this.action(route, opts);
		}
		var routes = this.listeners.getAll(path),
			imax = routes.length,
			i = -1;
		while ( ++i < imax ) {
			this.action(routes[i], opts);			
		}
	}
	action (route, opts) {
		if (typeof route.value === 'function') {
			var current = route.current;
			var params = current && current.params;
			if (opts.params != null) {
				params = obj_default(params, opts.params);
			}
			route.value(route, params);
		}
	}
	navigate (mix, opts) {
		this.emitter.navigate(mix, opts);
	}
	current () {
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
};
