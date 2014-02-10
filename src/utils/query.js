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

