import RouteCollection from './route/RouteCollection'
import Location from './emit/LocationEmitter'
import ApiUtils from './api/utils'
import options from './options'

let routes = new RouteCollection(),
	router: Location;

function router_ensure() {
	if (router == null)
		router = new Location(routes);

	return router;
}

export default {

	Collection: RouteCollection,

	setRouterType: function(type){
		if (router == null)
			router = new Location(routes, type);
		return this;
	},

	setStrictBehaviour (isStrict: boolean) {
		options.isStrict = isStrict;
		return this;
	},

	add: function(regpath, mix){
		router_ensure();
		routes.add(regpath, mix);
		return this;
	},

	on: function(regpath, mix){
		router_ensure().on(regpath, mix);
		return this;
	},
	off: function(regpath, mix){
		router_ensure().off(regpath, mix);
		return this;
	},

	get: function(path){
		return routes.get(path);
	},
	navigate: function(mix, opts){
		router_ensure().navigate(mix, opts);
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

	parse: RouteCollection.parse,

	/*
	 * @deprecated - use `_` instead
	 */
	$utils: ApiUtils,
	_     : ApiUtils,
};
