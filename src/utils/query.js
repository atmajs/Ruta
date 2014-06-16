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
			x, val;
			
		for (; i < imax; i++) {
			x = parts[i].split('=');
			val = x[1] == null
				? ''
				: decode(x[1])
				;
			obj_setProperty(obj, x[0], val);
		}
		return obj;
	};
	
	query_serialize = function(params, delimiter) {
		delimiter == null && (delimiter = '/');
	
		var query = '',
			key, val;
		for(key in params) {
			val = params[key];
			if (val == null) 
				continue;
			
			// serialize as flag
			if (typeof val === 'boolean') 
				val = null;
			
			query = query + (query ? delimiter : '') + key;
			if (val != null) 
				query += '=' + encodeURIComponent(val);
		}
	
		return query;
	};
	
	
	function obj_setProperty(obj, property, value) {
		var chain = property.split('.'),
			imax = chain.length,
			i = -1,
			key;
	
		while ( ++i <  imax - 1) {
			key = chain[i];
			
			if (obj[key] == null) 
				obj[key] = {};
			
			obj = obj[key];
		}
	
		obj[chain[i]] = value;
	}
	function decode(str) {
		try {
			return decodeURIComponent(str)
		} catch(error) {
			return '';
		}
	}
}());

