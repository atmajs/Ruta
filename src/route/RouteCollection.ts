import Route from './Route'
import {route_match, route_matchAll } from './match'
import { route_parseDefinition, route_parsePath } from './route_utils'

export default class RouteCollection {
	//type: 'url' | 'hash' = 'url'
	routes: Route[] = []	
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
	get (path: string, method?: string): Route {
		//@TODO Sometimes user can request route by full url when using hash router, should we do smth.here
		//-path = this.normalizePath(path);
		return route_match(path, this.routes, method);
	}
	getAll (path: string, method?: string) {
		//-path = this.normalizePath(path)
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
	// private normalizePath (path: string) {
	// 	if (this.type === 'hash' && path.indexOf('#') !== -1) {
	// 		return path.substring(path.indexOf('#') + 1);
	// 	}
	// 	return path;
	// }
};