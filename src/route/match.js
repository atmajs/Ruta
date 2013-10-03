	
	
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