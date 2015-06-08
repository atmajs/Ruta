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
	navigate: function(mix, opts){
		var path = mix;
		if (mix != null && typeof mix === 'object') {
			path = '?' + query_serialize(mix, '&');
		}
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
	
	/*
	 * @deprecated - use `_` instead
	 */
	$utils: ApiUtils,
	_     : ApiUtils,
};


