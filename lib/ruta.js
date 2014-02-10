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
	
	// source ../src/vars.js
	
	var mask = global.mask || Mask;
	
	// settings
	
	/** define if routes like '/path' are strict by default,
	 * or set explicit '!/path' - strict, '^/path' - not strict
	 *
	 * Strict means - like in regex start-end /^$/
	 * */
	var	_cfg_isStrict = true;
	// end:source ../src/vars.js
	// source ../src/utils/path.js
	var path_normalize,
		path_split,
		path_join,
		path_fromCLI
		;
	
	(function(){
	
	
		path_normalize = function(str) {
			
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
		};
		
		path_split = function(path) {
			path = path_normalize(path);
			
			return path === ''
				? []
				: path.split('/');
		};
		
		path_join = function(pathParts) {
			return '/' + pathParts.join('/');
		};
		
		path_fromCLI = function(commands){
			
			if (typeof commands === 'string') 
				commands = cli_split(commands);
			
			var parts = cli_parseArguments(commands);
			
			return parts_serialize(parts);
		};
		
		
		// == private
		
		function cli_split(string){
			var args = string.trim().split(/\s+/);
					
			var imax = args.length,
				i = -1,
				c, arg;
				
			while ( ++i < imax ){
				
				arg = args[i];
				if (arg.length === 0) 
					continue;
				
				c = arg[0];
				
				if (c !== '"' && c !== "'") 
					continue;
				
				
				var start = i;
				for( ; i < imax; i++ ){
					
					arg = args[i];
					if (arg[arg.length - 1] === c) {
						
						var str = args
							.splice(start, i - start + 1)
							.join(' ')
							.slice(1,  -1)
							;
						
						args.splice(start, 0, str);
						imax = args.length;
						break;
					}
				}
			}
			
			return args;
		}
		
		function cli_parseArguments(argv){
			var imax = argv.length,
				i = 0,
				params = {},
				args = [],
				key, val, x;
			
			for (; i < imax; i++){
				x = argv[i];
				
				if (x[0] === '-') {
					
					key = x.replace(/^[\-]+/, '');
					
					if (i < imax - 1 && argv[i + 1][0] !== '-') {
						val = argv[i + 1];
						i++;
					} else {
						val = true;
					}
					
					params[key] = val;
					continue;
				}
				
				args.push(x);
			}
			
			return {
				path: args,
				query: params
			};	
		}
	
	}());
	
	// end:source ../src/utils/path.js
	// source ../src/utils/query.js
	var query_deserialize,
		query_serialize
		;
	
	(function(){
	
		query_deserialize = function(query, delimiter) {
			delimiter == null && (delimiter = '/');
		
			var obj = {},
				parts = query.split(delimiter),
				i = 0,
				imax = parts.length,
				x;
		
			for (; i < imax; i++) {
				x = parts[i].split('=');
		
				obj[x[0]] = x[1] == null
					? ''
					: decodeURIComponent(x[1])
					;
		
			}
			return obj;
		};
		
		query_serialize = function(params, delimiter) {
			delimiter == null && (delimiter = '/');
		
			var query = '',
				key;
		
			for (key in params) {
				query = (query ? delimiter : '') + key + '=' + encodeURIComponent(params[key]);
			}
		
			return query;
		};
		
	}());
	
	
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
	// source ../src/utils/parts.js
	
	/**
	 *	'/foo/bar?a=b' =>
	 *	{ path: ['foo', 'bar'], query: { a: 'b' } }
	 */
	
	var parts_serialize,
		parts_deserialize
		;
	
	(function(){
		
	
		parts_serialize = function(parts){
			var path = path_join(parts.path);
			
			if (parts.query == null) 
				return path;
			
			return path
					+ '?'
					+ query_serialize(parts.query, '&')
				;
		};
		
		parts_deserialize = function(url){
			var query = url.indexOf('?'),
				path = query === -1
					? url
					: url.substring(0, query);
			
			
			return {
				path: path_split(path),
				query: query === -1
					? null
					: query_deserialize(url.substring(query + 1), '&')
			}
		};
		
		
	}());
	
	// end:source ../src/utils/parts.js

	// source ../src/route/Collection.js
	var Routes = (function(){
		
		// source Route.js
		
		// source parse.js
		
		function route_parseDefinition(route, definition) {
			
			var c = definition.charCodeAt(0);
			switch(c){
				case 33:
					// !
					route.strict = true;
					definition = definition.substring(1);
					break;
				case 94:
					// ^
					route.strict = false;
					definition = definition.substring(1);
					break;
				case 40:
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
				search,
				searchIndex,
				i = 0,
				imax = parts.length,
				x,
				c0,
				index,
				c1;
				
			
			var last = parts[imax - 1];
			searchIndex = last.indexOf('?');
			if (searchIndex > (imax === 1 ? -1 : 0)) {
				// `?` cannt be at `0` position, when has url definition contains `path`
				search = last.substring(searchIndex + 1);
				parts[imax - 1] = last.substring(0, searchIndex);
			}
		
			var matcher = '',
				alias = null,
				strictCount = 0;
		
			var gettingMatcher = true,
				isOptional,
				isAlias,
				rgx;
		
			var array = route.path = [];
			
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
		
			if (search) {
				var query = route.query = {};
				
				parts = search.split('&');
				
				i = -1;
				imax = parts.length;
				
				var key, value, str, eqIndex;
				while(++i < imax){
					str = parts[i];
					
					eqIndex = str.indexOf('=');
					if (eqIndex === -1) {
						query[str] = '';
						continue;
					}
					
					key = str.substring(0, eqIndex);
					value = str.substring(eqIndex + 1);
					
					if (value.charCodeAt(0) === 40) {
						// (
						value = new RegExp(rgx_aliasMatcher(value));
					}
					
					query[key] = value;
				}
				
				if (route.path.length === 0) {
					route.strict = false;
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
		
			if (route.path != null) {
					
				var pathArr = path_split(path),
					routePath = route.path,
					routeLength = routePath.length,
					
					imax = pathArr.length,
					i = 0,
					part,
					x;
			
				for (; i < imax; i++) {
					part = pathArr[i];
					x = i < routeLength ? routePath[i] : null;
					
					if (x) {
						
						if (typeof x === 'string') 
							continue;
						
						if (x.alias) {
							current.params[x.alias] = part;
							continue;
						}
					}
				}
			}
		
			return current;
		}
		
		// end:source parse.js
		// source match.js
			
			
		function route_match(url, routes, currentMethod){
			
			var parts = parts_deserialize(url);
			
			
			for (var i = 0, route, imax = routes.length; i < imax; i++){
				route = routes[i];
				
				if (route_isMatch(parts, route, currentMethod)) {
					
					route.current = route_parsePath(route, url);
					return route;
				}
			}
			
			return null;
		};
		
		function route_isMatch(parts, route, currentMethod) {
			
			if (currentMethod != null &&
				route.method != null &&
				route.method !== currentMethod) {
				return false;
			}
			
			if (route.match) {
				
				return route.match.test(
					typeof parts === 'string'
						? parts
						: parts_serialize(parts)
				);
			}
			
			
			if (typeof parts === 'string') 
				parts = parts_deserialize(parts);
		
				
			if (route.query) {
				var query = parts.query,
					key, value;
				if (query == null) 
					return false;
				
				for(key in route.query){
					value = route.query[key];
					
					if (typeof value === 'string') {
						
						if (query[key] == null) 
							return false;
						
						if (value && query[key] !== value) 
							return false;
						
						continue;
					}
					
					if (value.test && !value.test(query[key])) 
						return false;
				}
			}
			
				
			var routePath = route.path,
				routeLength = routePath.length;
			
			
			if (routeLength === 0) {
				if (route.strict) 
					return parts.path.length === 0;
				
				return true;
			}
			
			
			
			for (var i = 0, x, imax = parts.path.length; i < imax; i++){
				
				x = routePath[i];
				
				if (i >= routeLength) 
					return route.strict !== true;
				
				if (typeof x === 'string') {
					if (parts.path[i] === x) 
						continue;
					
					return false;
				}
				
				if (x.matcher && x.matcher.test(parts.path[i]) === false) {
					return false;
				}
				
				if (x.optional) 
					return true;
				
				if (x.alias) 
					continue;
				
				return false;
			}
			
			if (i < routeLength) 
				return routePath[i].optional === true;
				
			
			return true;
		}
		// end:source match.js
		
		var regexp_var = '([^\\\\]+)';
		
		function Route(definition, value) {
			
			this.method = definition.charCodeAt(0) === 36
				? definition.substring(1, definition.indexOf(' ')).toUpperCase()
				: null
				;
			
			if (this.method != null) {
				definition = definition.substring( this.method.length + 2 );
			}
			
			this.strict = _cfg_isStrict;
			this.value = value;
			this.definition = definition;
			
			route_parseDefinition(this, definition);
		}
		
		Route.prototype = {
			path: null,
			query: null,
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