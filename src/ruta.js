
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
		return this;
	},
	
	add: function(regpath, mix){
		router_ensure();
		routes.add(regpath, mix);
		return this;
	},
	
	get: function(path){
		return routes.get(path);
	},
	navigate: function(path, opts){
		router_ensure().navigate(path, opts);
		return this;
	},
	current: function(){
		return router_ensure().current();
	},
	currentPath: function(){
		return router_ensure().currentPath();
	},
	
	notifyCurrent: function(){
		router_ensure().navigate();
		return this;
	},
	
	parse: Routes.parse,
	
	$utils: {
		/*
		 * Format URI path from CLI command:
		 * some action -foo bar === /some/action?foo=bar
		 */
		pathFromCLI: path_fromCLI,
		
		query: {
			serialize: query_serialize,
			deserialize: query_deserialize,
			get: function(path_){
				var path = path_ == null
					? location.search
					: path_;
				return path_getQuery(path);
			}
		}
	}
};


