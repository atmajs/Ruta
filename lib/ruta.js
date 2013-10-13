(function(root, factory){
	"use strict";
	
	if (root == null) {
		root = typeof window !== 'undefined' && typeof document !== 'undefined' 
			? window 
			: global;
	}
	
	
	root.ruta = factory(root);
	
}(this, function(global){
	"use strict";
	
	var mask = global.mask || Mask;
	
	// source ../src/utils/path.js
	function path_normalize(str) {
		
		var length = str.length,
			i = 0,
			j = length - 1;
			
		for(; i < length; i++) {
			if (str[i] === '/') 
				continue;
			
			break;
		}
		for (; j > i; j--) {
			if (str[j] === '/') 
				continue;
			
			break;
		}
		
		return str.substring(i, j + 1);
	}
	
	function path_split(path) {
		path = path_normalize(path);
		
		return path === ''
			? []
			: path.split('/');
	}
	
	function path_join(parts) {
		return '/' + parts.join('/');
	}
	
	// end:source ../src/utils/path.js
	// source ../src/utils/query.js
	function query_deserialize(query, delimiter) {
		delimiter == null && (delimiter = '/');
	
		var obj = {},
			parts = query.split(delimiter),
			i = 0,
			imax = parts.length,
			x;
	
		for (; i < imax; i++) {
			x = parts[i].split('=');
	
			obj[x[0]] = decodeURIComponent(x[1]);
	
		}
	
		return obj;
	}
	
	function query_serialize(params, delimiter) {
		delimiter == null && (delimiter = '/');
	
		var query = '',
			key;
	
		for (key in params) {
			query = (query ? delimiter : '') + key + '=' + encodeURIComponent(params[key]);
		}
	
		return query;
	}
	
	
	// end:source ../src/utils/query.js
	// source ../src/utils/rgx.js
	
	function rgx_fromString(str, flags) {
		return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), flags);
	}
	
	/**
	 *  Url part should be completely matched, so add ^...$
	 */
	function rgx_aliasMatcher(str){
		
		if (str[0] === '^') 
			return new RegExp(str);
		
		var groups = str.split('|');
		for (var i = 0, imax = groups.length; i < imax; i++){
			groups[i] = '^' + groups[i] + '$';
		}
		
		return new RegExp(groups.join('|'));
	}
	
	
	// end:source ../src/utils/rgx.js

	// source ../src/route/Collection.js
	var Routes = (function(){
		
		// source Route.js
		
		// source parse.js
		
		function route_parseDefinition(route, definition) {
			
			if (definition.charCodeAt(0) === 33) {
				// !
				route.strict = true;
				definition = definition.substring(1);
			}
			
			if (definition.charCodeAt(0) === 40) {
				// (
				var start = 1,
					end = definition.length - 1
					;
				if (definition.charCodeAt(definition.length - 1) !== 41) {
					// )
					console.error('<ruta> rgx parse - expect group closing');
					end ++;
				}
				
				route.match = new RegExp(definition.substring(start, end));
				return;
			}
			
			
			var parts = definition.split('/'),
				i = 0,
				imax = parts.length,
				x,
				c0,
				index,
				c1;
		
			var matcher = '',
				alias = null,
				strictCount = 0;
		
			var gettingMatcher = true,
				isOptional,
				isAlias,
				rgx;
		
			var array = route.parts = [];
			
			for (; i < imax; i++) {
				x = parts[i];
				
				if (x === '') 
					continue;
				
		
				c0 = x.charCodeAt(0);
				c1 = x.charCodeAt(1);
		
				isOptional = c0 === 63; /* ? */
				isAlias = (isOptional ? c1 : c0) === 58; /* : */
				index = 0;
				
				if (isOptional) 
					index++;
				
				if (isAlias) 
					index++;
				
		
				if (index !== 0) 
					x = x.substring(index);
				
		
				// if DEBUG
				!isOptional && !gettingMatcher && console.log('<ruta> strict part found after optional', definition);
				// endif
		
		
				if (isOptional) 
					gettingMatcher = false;
				
				var bracketIndex = x.indexOf('(');
				if (isAlias && bracketIndex !== -1) {
					var end = x.length - 1;
					if (x[end] !== ')') 
						end+= 1;
					
					rgx = new RegExp(rgx_aliasMatcher(x.substring(bracketIndex + 1, end)));
					x = x.substring(0, bracketIndex);
				}
				
				if (!isOptional && !isAlias) {
					array.push(x);
					continue;
				}
				
				if (isAlias) {
					array.push({
						alias: x,
						matcher: rgx,
						optional: isOptional
					});
				}
				
			}
		
		}
		
		
		/* - path should be already matched by the route */
		
		function route_parsePath(route, path) {
			
			var queryIndex = path.indexOf('?'),
				
				query = queryIndex === -1
					? null
					: path.substring(queryIndex + 1),
				
				current = {
					path: path,
					params: query == null
						? {}
						: query_deserialize(query, '&')
				};
		
			if (queryIndex !== -1) {
				path = path.substring(0, queryIndex);
			}
		
			var parts = path_split(path),
				routeParts = route.parts,
				routeLength = routeParts.length,
				
				imax = parts.length,
				i = 0,
				part,
				x;
		
			for (; i < imax; i++) {
				part = parts[i];
				x = i < routeLength ? routeParts[i] : null;
				
				if (x) {
					
					if (typeof x === 'string') 
						continue;
					
					if (x.alias) {
						current.params[x.alias] = part;
						continue;
					}
					
				}
			}
		
			return current;
		}
		
		// end:source parse.js
		// source match.js
			
			
		function route_match(url, routes){
			url = path_normalize(url);
			
			var query = url.indexOf('?'),
				path = query === -1
					? url
					: url.substring(0, query);
			
			
			var parts = path_split(path);
			
			for (var i = 0, route, imax = routes.length; i < imax; i++){
				route = routes[i];
				
				if (route_isMatch(parts, route)) {
					route.current = route_parsePath(route, url);
					
					return route;
				}
			}
			
			return null;
		};
		
		function route_isMatch(parts, route) {
			
			if (route.match) {
				
				return route.match.test(
					typeof parts === 'string'
						? parts
						: parts.join('/')
				);
			}
			
			if (typeof parts === 'string') 
				parts = path_split(parts);
			
			
				
			var routeParts = route.parts,
				routeLength = routeParts.length;
		
			
			
			for (var i = 0, x, imax = parts.length; i < imax; i++){
				
				x = routeParts[i];
				
				if (i >= routeLength) 
					return route.strict !== true;
				
				if (typeof x === 'string') {
					if (parts[i] === x) 
						continue;
					
					return false;
				}
				
				if (x.matcher && x.matcher.test(parts[i]) === false) {
					return false;
				}
				
				if (x.optional) 
					return true;
				
				if (x.alias) 
					continue;
				
				return false;
			}
			
			if (i < routeLength) 
				return routeParts[i].optional === true;
				
			
			return true;
		}
		// end:source match.js
		
		var regexp_var = '([^\\\\]+)';
		
		function Route(definition, value) {
			
			this.method = definition.charCodeAt(0) === 36
				? definition.substring(1, definition.indexOf(' ')).toUpperCase()
				: ''
				;
			
			if (this.method !== '') {
				definition = definition.substring( this.method.length + 2 );
			}
				
			this.value = value;
			this.definition = definition;
			
			route_parseDefinition(this, definition);
		}
		
		Route.prototype = {
			parts: null,
			value: null,
			current: null
		};
		
		// end:source Route.js
		
		
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
		};
		
		RouteCollection.parse = function(definition, path){
			var route = {};
			
			route_parseDefinition(route, definition);
			return route_parsePath(route, path);
		};
		
		
		return RouteCollection;
	}());
	// end:source ../src/route/Collection.js

	// source ../src/emit/Location.js
	
	var Location = (function(){
		
		if (typeof window === 'undefined') {
			return function(){};
		}
		
		// source Hash.js
		function HashEmitter(listener) {
		
			if (typeof window === 'undefined' || 'onhashchange' in window === false)
				return null;
		
		
			var that = this;
		
			that.listener = listener;
		
			window.onhashchange = function() {
				that.changed(location.hash);
			}
		
			return that;
		}
		
		(function() {
			
			function hash_normalize(hash) {
				return hash.replace(/^[!#/]+/, '/');
			}
			
			HashEmitter.prototype = {
				navigate: function(hash) {
					
					location.hash = hash;
				},
		
				changed: function(hash) {
					this
						.listener
						.changed(hash_normalize(hash));
						
				},
		
				current: function() {
					
					return hash_normalize(location.hash);
				}
			};
		
		}());
		// end:source Hash.js
		// source History.js
		
		function HistoryEmitter(listener){
			
			if (typeof window === 'undefined')
				return null;
			
			if (!(window.history && window.history.pushState))
				return null;
		
			var that = this;	
			
			that.listener = listener;
			that.initial = location.pathname;
			
			
			window.onpopstate = function(){
				if (that.initial === location.pathname) {
					that.initial = null;
					return;
				}
				
				that.changed();
			};
			
			return that;
		}
		
		(function(){
			
			HistoryEmitter.prototype = {
				navigate: function(url){
					history.pushState({}, null, url);
					this.changed();
				},
				
				changed: function(){
					
					this.listener.changed(location.pathname + location.search);
				},
				current: function(){
					
					return location.pathname + location.search;
				}
			};
		
		}());
		// end:source History.js
		
		function Location(collection, type) {
			
			this.collection = collection || new Routes();
			
			if (type) {
				var Constructor = type === 'hash'
					? HashEmitter
					: HistoryEmitter
					;
				this.emitter = new Constructor(this);
			}
			
			if (this.emitter == null) 
				this.emitter = new HistoryEmitter(this);
			
			if (this.emitter == null) 
				this.emitter = new HashEmitter(this);
			
			if (this.emitter == null) 
				console.error('Router can not be initialized - (nor History API / nor Hashchage');
		}
		
		Location.prototype = {
			
			changed: function(path){
				var item = this.collection.get(path);
				
				if (item)
					this.action(item);
				
			},
			action: function(route){
				
				if (typeof route.value === 'function')
					route.value(route);
			},
			navigate: function(url){
				this.emitter.navigate(url);
			},
			current: function(){
				var path = this.emitter.current();
				
				return this.collection.get(path);
			}
		};
		
		return Location;
	}());
	// end:source ../src/emit/Location.js
	// source ../src/ruta.js
	
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
		
		parse: Routes.parse
	};
	
	
	
	// end:source ../src/ruta.js
	
	// source ../src/mask/attr/anchor-dynamic.js
	
	
	(function() {
		
			
		mask.registerAttrHandler('x-dynamic', function(node, value, model, cntx, tag){
			
			tag.onclick = navigate;
			
		}, 'client');
		
		function navigate(event) {
			event.preventDefault();
			event.stopPropagation();
			
			Ruta.navigate(this.href);
		}
		
	}());
	
	// end:source ../src/mask/attr/anchor-dynamic.js
	
	return Ruta;
}));