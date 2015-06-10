function HistoryEmitter(listener){	
	if (typeof window === 'undefined')
		return null;
	
	if (!(window.history && window.history.pushState))
		return null;

	var that = this;
	that.listener = listener;
	that.initial = location.pathname;
	
	window.onpopstate = function(){
		if (that.initial === location.pathname) {
			that.initial = null;
			return;
		}
		that.changed();
	};
	
	return that;
}

HistoryEmitter.prototype = {
	navigate: function(mix, opts){
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
		
		
		history.pushState({}, null, url);
		this.initial = null;
		this.changed();
	},
	changed: function(){
		this.listener.changed(location.pathname + location.search);
	},
	current: function(){
		return location.pathname + location.search;
	}
};
