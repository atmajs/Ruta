
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

(function(){
	
	HistoryEmitter.prototype = {
		navigate: function(url){
			if (url == null) {
				this.changed();
				return;
			}
			
			history.pushState({}, null, url);
			this.changed();
		},
		
		changed: function(){
			
			this.listener.changed(location.pathname + location.search);
		},
		current: function(){
			
			return location.pathname + location.search;
		}
	};

}());