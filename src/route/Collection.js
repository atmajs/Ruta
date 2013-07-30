var Routes = (function(){
	
	// import Route.js
	
	
	function RouteCollection() {
		this.routes = [];
	}
	
	RouteCollection.prototype = {
		add: function(regpath, value){
			
			this.routes.push(new Route(regpath, value));
			
			return this;
		},
		
		get: function(path){
			
			return route_match(path, this.routes);
		}
	}
	
	
	return RouteCollection;
}());