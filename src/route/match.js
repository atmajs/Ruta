	
	
function route_match(url, routes, currentMethod){
	
	var parts = path_getPartsFromUrl(url);
	
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
				: parts.join('/')
		);
	}
	
	if (typeof parts === 'string') 
		parts = path_getPartsFromUrl(parts);
	
	
		
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