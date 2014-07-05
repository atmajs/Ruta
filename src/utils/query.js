var query_deserialize,
	query_serialize
	;

(function(){

	query_deserialize = function(query, delimiter) {
		if (delimiter == null) 
			delimiter = '&';
		
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
		if (delimiter == null) 
			delimiter = '&';
		
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
				query += '=' + encode(val);
		}
	
		return query;
	};
	
	// = private
	
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
			return decodeURIComponent(str);
		} catch(error) {
			log_error('decode:URI malformed');
			return '';
		}
	}
	function encode(str) {
		try {
			return encodeURIComponent(str);
		} catch(error) {
			log_error('encode:URI malformed');
			return '';
		}
	}
}());

