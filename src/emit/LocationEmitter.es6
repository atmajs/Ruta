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
		var item = this.collection.get(path);
		if (item && (opts == null || opts.silent !== true)) {
			this.action(item);
		}
		var listeners = this.listeners.getAll(path),
			imax = listeners.length,
			i = -1;
		while ( ++i < imax ) {
			listeners[i].value(listeners[i]);
		}
	}
	action (route) {
		if (typeof route.value === 'function') {
			var current = route.current;
			route.value(route, current && current.params);
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
