class RouteCollection {
	constructor () {
		this.routes = [];
	}
	add (...args){
		return this.push(...args);
	}
	push (def, value) {
		var route = new Route(def, value);
		this.routes.push(route);
		return this;
	}
	unshift (def, value) {
		var route = new Route(def, value);
		this.routes.unshift(route);
		return this;
	}
	remove (def, value) {
		var imax = this.routes.length,
			i = -1;
		while ( ++i < imax ) {
			var route = this.routes[i];
			if (def == null || route.definition !== def) {
				continue;
			}
			if (value == null || route.value !== value) {
				continue;
			}
			this.routes.splice(i, 1);
			i--;
		}
	}
	get (path, method){
		return route_match(path, this.routes, method);
	}
	getAll (path, method) {
		return route_matchAll(path, this.routes, method);
	}
	clear (){
		this.routes.length = 0;
		return this;
	}

	static parse (definition, path){
		var route = {};

		route_parseDefinition(route, definition);
		return route_parsePath(route, path);
	}
};