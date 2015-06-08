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
	navigate: function(url, opts){
		if (url == null) {
			this.changed();
			return;
		}
		
		if (opts != null && opts.extend === true) {
			var query   = path_getQuery(url),
				current = path_getQuery(location.search);
				
			if (current != null && query != null) {
				query = obj_extend(current, query);
				url = path_setQuery(url, query);
			}
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
