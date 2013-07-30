
function route_parseDefinition(route, definition) {
	
	if (definition[0] === '!') {
		route.strict = true;
		definition = definition.substring(1);
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
		isConditional,
		isAlias;

	var array = [];
	
	for (; i < imax; i++) {
		x = parts[i];
		
		if (x === '') 
			continue;
		

		c0 = x.charCodeAt(0);
		c1 = x.charCodeAt(1);

		isConditional = c0 === 63; /* ? */
		isAlias = (isConditional ? c1 : c0) === 58; /* : */
		index = 0;
		
		if (isConditional) 
			index++;
		
		if (isAlias) 
			index++;
		

		if (index !== 0) 
			x = x.substring(index);
		

		// if DEBUG
		!isConditional && !gettingMatcher && console.log('Strict route part found after conditional', definition);
		// endif


		if (isConditional) 
			gettingMatcher = false;
		

		if (gettingMatcher) {
			strictCount += 1;
			matcher += '/' + (isAlias ? regexp_var : x)
		}

		if (isAlias) {
			(alias || (alias = {}))[index] = x;
		}
		
		if (!isConditional && !isAlias) {
			array.push(x);
			continue;
		}
		
		if (isAlias) {
			array.push({
				alias: x,
				optional: isConditional
			});
		}
		
	}

	route.parts = array;
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
