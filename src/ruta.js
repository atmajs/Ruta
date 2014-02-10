
var routes = new Routes(),
	router;

function router_ensure() {
	if (router == null) 
		router = new Location(routes);
		
	return router;
}

var Ruta = {
	
	Collection: Routes,
	
	setRouterType: function(type){
		if (router == null) 
			router = new Location(routes, type);
		
		return this;
	},
	
	setStrictBehaviour: function(isStrict){
		_cfg_isStrict = isStrict;
	},
	
	add: function(regpath, mix){
		router_ensure();
		
		return routes.add(regpath, mix);
	},
	
	get: function(path){
		
		return routes.get(path);
	},
	navigate: function(path){
		
		router_ensure()
			.navigate(path);
	},
	
	current: function(){
		
		return router_ensure()
			.current();
	},
	
	parse: Routes.parse,
	
	$utils: {
		
		pathFromCLI: path_fromCLI
	}
};


