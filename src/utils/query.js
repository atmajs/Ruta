function query_deserialize(query, delimiter) {
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
}

function query_serialize(params, delimiter) {
	delimiter == null && (delimiter = '/');

	var query = '',
		key;

	for (key in params) {
		query = (query ? delimiter : '') + key + '=' + encodeURIComponent(params[key]);
	}

	return query;
}
////
//// @obsolete - use query_deserialize
////function query_split(query){
////	var parts = query.split('&'),
////		i = -1,
////		imax = parts.length,
////		search = {},
////		eqIndex,
////		key,
////		value
////		;
////	while(++i < imax){
////		key = parts[i];
////		eqIndex = key.indexOf('=');
////		if (eqIndex === -1) {
////			search[key] = '';
////			continue;
////		}
////		
////		value = decodeURIComponent(key.substring(eqIndex + 1));
////		key = key.substring(0, eqIndex);
////		
////		search[key] = value;
////	}
////	
////	return search;
////}
