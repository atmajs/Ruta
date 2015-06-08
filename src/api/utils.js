var ApiUtils = {
	/*
	 * Format URI path from CLI command:
	 * some action -foo bar === /some/action?foo=bar
	 */
	pathFromCLI: path_fromCLI,
	
	query: {
		serialize: query_serialize,
		deserialize: query_deserialize,
		get: function(path_){
			var path = path_ == null
				? location.search
				: path_;
			return path_getQuery(path);
		}
	}
};