var route_match,
	route_isMatch
	;
	
(function(){
	
	route_match = function(url, routes, currentMethod){
		
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
	
	route_isMatch = function(parts, route, currentMethod) {
		
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
	
		// route defines some query, match these with the current path{parts}
		if (route.query) {
			var query = parts.query,
				key, value;
			if (query == null) 
				return false;
			
			for(key in route.query){
				value = route.query[key];
				
				
				var c = key[0];
				if (c === ':') {
					// '?:isGlob(g|glob) will match if any is present
					var alias = rgx_parsePartWithRegExpAlias(key);
					if (alias == null || hasKey(query, alias.matcher) === false)
						return false;
					
					continue;
				}
				
				if (c === '?') 
					continue;
				
				
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
	};
	
	
	function hasKey(obj, rgx){
		
		for(var key in obj){
			if (rgx.test(key)) 
				return true;
		}
		return false;
	}
	
}());
