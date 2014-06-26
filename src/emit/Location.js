
var Location = (function(){
	
	if (typeof window === 'undefined') {
		return function(){};
	}
	
	// import Hash.js
	// import History.js
	
	function Location(collection, type) {
		
		this.collection = collection || new Routes();
		
		if (type) {
			var Constructor = type === 'hash'
				? HashEmitter
				: HistoryEmitter
				;
			this.emitter = new Constructor(this);
		}
		
		if (this.emitter == null) 
			this.emitter = new HistoryEmitter(this);
		
		if (this.emitter == null) 
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
			
			if (typeof route.value === 'function')
				route.value(route);
		},
		navigate: function(url){
			this.emitter.navigate(url);
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