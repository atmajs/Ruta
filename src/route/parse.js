
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
