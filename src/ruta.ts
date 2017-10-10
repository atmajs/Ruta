import RouteCollection from './route/RouteCollection'
import Location from './emit/LocationEmitter'
import ApiUtils from './api/utils'
import options from './options'
import './mask/attr/anchor-dynamic'

let routes = new RouteCollection(),
	router: Location;

function router_ensure() {
	if (router == null)
		router = new Location(routes);

	return router;
}

export default {

	Collection: RouteCollection,

	setRouterType (type){
		if (router == null)
			router = new Location(routes, type);
		return this;
	},

	setStrictBehaviour (isStrict: boolean) {
		options.isStrict = isStrict;
		return this;
	},

	add (regpath, mix){
		router_ensure();
		routes.add(regpath, mix);
		return this;
	},

	on (regpath, mix){
		router_ensure().on(regpath, mix);
		return this;
	},
	off (regpath, mix){
		router_ensure().off(regpath, mix);
		return this;
	},
	onLifecycle (def, cb) {
		router_ensure().onLifecycle(def, cb);
		return this;
	},
	offLifecycle (def, cb) {
		router_ensure().offLifecycle(def, cb);
		return this;
	},

	get (path){
		return routes.get(path);
	},
	navigate (mix, opts?){
		router_ensure().navigate(mix, opts);
		return this;
	},
	current (){
		return router_ensure().current();
	},
	currentPath (){
		return router_ensure().currentPath();
	},

	notifyCurrent (){
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
