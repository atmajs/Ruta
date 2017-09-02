import Route from './Route'
import {route_match, route_matchAll } from './match'
import { route_parseDefinition, route_parsePath } from './route_utils'

export default class RouteCollection {
	routes: Route[]
	constructor () {
		this.routes = [];
	}
	/** alias for `push` */
	add (def: string, value: any): this {
		this.push(def, value);
		return this;
	}
	push (def: string, value: any): this {
		this.routes.push(new Route(def, value));
		return this;
	}
	unshift (def: string, value: any): this {
		var route = new Route(def, value);
		this.routes.unshift(route);
		return this;
	}
	remove (def: string, value: any) {
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
			imax--;
		}
	}
	get (path, method?){
		return route_match(path, this.routes, method);
	}
	getAll (path, method?) {
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