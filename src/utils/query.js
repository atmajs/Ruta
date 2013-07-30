function query_deserialize(query, delimiter) {
	delimiter == null && (delimiter = '/');

	var obj = {},
		parts = query.split(delimiter),
		i = 0,
		imax = parts.length,
		x;

	for (; i < imax; i++) {
		x = parts[i].split('=');

		obj[x[0]] = decodeURIComponent(x[1]);

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

