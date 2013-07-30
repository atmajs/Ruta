
var Location = (function(){
	
	if (typeof window === 'undefined') {
		return function(){};
	}
	
	// import Hash.js
	// import History.js
	
	function Location(collection, action) {
		
		this.collection = collection || new Routes();
		this.emitter = new HistoryEmitter(this);
		
		if (action) 
			this.action = action;
		
		
		if (this.emitter == null) 
			this.emitter = new HashEmitter(this);
		
		if (this.emitter == null) 
			console.error('Router can not be initialized - (nor History API / nor Hashchage');
	}
	
	Location.prototype = {
		
		changed: function(path){
			var item = this.collection.get(path);
			
			if (item)
				this.action(item);
			
		},
		action: function(route){
			route.value(route)
		},
		navigate: function(url){
			this.emitter.navigate(url);
		},
		current: function(){
			var path = this.emitter.current();
			
			return this.collection.get(path);
		}
	};
	
	return Location;
}());