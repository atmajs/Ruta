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
		
		get: function(path, currentMethod){
			
			return route_match(path, this.routes, currentMethod);
		}
	};
	
	RouteCollection.parse = function(definition, path){
		var route = {};
		
		route_parseDefinition(route, definition);
		return route_parsePath(route, path);
	};
	
	
	return RouteCollection;
}());