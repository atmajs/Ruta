
var Location = (function(){

	if (typeof window === 'undefined') {
		return function(){};
	}

	// import Hash.es6
	// import History.es6

	function Location(collection, type) {

		this.collection = collection || new Routes();

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

		if (this.emitter == null)
			log_error('Router can not be initialized - (nor HistoryAPI / nor hashchange');
	}

	Location.prototype = {

		changed: function(path){
			var item = this.collection.get(path);

			if (item)
				this.action(item);

		},
		action: function(route){
			if (typeof route.value === 'function') {
				var current = route.current;
				route.value(route, current && current.params);
			}
		},
		navigate: function(mix, opts){
			this.emitter.navigate(mix, opts);
		},
		current: function(){
			return this.collection.get(
				this.currentPath()
			);
		},
		currentPath: function(){
			return this.emitter.current();
		}
	};

	return Location;
}());