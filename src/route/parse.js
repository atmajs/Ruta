
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
