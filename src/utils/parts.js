
function parts_serialize(parts){
	var path = path_join(parts.path);
	
	if (parts.query == null) 
		return path;
	
	return path
			+ '?'
			+ query_serialize(parts.query, '&')
		;
}

function parts_deserialize(url){
	var query = url.indexOf('?'),
		path = query === -1
			? url
			: url.substring(0, query);
	
	
	return {
		path: path_split(path),
		query: query === -1
			? null
			: query_deserialize(url.substring(query + 1), '&')
	}
}
