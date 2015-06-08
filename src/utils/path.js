var path_normalize,
	path_split,
	path_join,
	path_fromCLI,
	path_getQuery,
	path_setQuery
	;

(function(){


	path_normalize = function(str) {
		
		var length = str.length,
			i = 0,
			j = length - 1;
			
		for(; i < length; i++) {
			if (str[i] === '/') 
				continue;
			
			break;
		}
		for (; j > i; j--) {
			if (str[j] === '/') 
				continue;
			
			break;
		}
		
		return str.substring(i, j + 1);
	};
	
	path_split = function(path) {
		path = path_normalize(path);
		
		return path === ''
			? []
			: path.split('/');
	};
	
	path_join = function(pathParts) {
		return '/' + pathParts.join('/');
	};
	
	path_fromCLI = function(commands){
		
		if (typeof commands === 'string') 
			commands = cli_split(commands);
		
		var parts = cli_parseArguments(commands);
		
		return parts_serialize(parts);
	};
	
	path_getQuery = function(path){
		var i = path.indexOf('?');
		if (i === -1) 
			return null;
		
		var query = path.substring(i + 1);
		return query_deserialize(query, '&');
	};
	
	path_setQuery = function(path, mix){
		var query =  typeof mix !== 'string'
			? query_serialize(mix, '&')
			: mix;
			
		var i = path.indexOf('?');
		if (i !== -1) {
			path = path.substring(0, i);
		}
		return path + '?' + query;
	};
	
	// == private
	
	function cli_split(string){
		var args = string.trim().split(/\s+/);
				
		var imax = args.length,
			i = -1,
			c, arg;
			
		while ( ++i < imax ){
			
			arg = args[i];
			if (arg.length === 0) 
				continue;
			
			c = arg[0];
			
			if (c !== '"' && c !== "'") 
				continue;
			
			
			var start = i;
			for( ; i < imax; i++ ){
				
				arg = args[i];
				if (arg[arg.length - 1] === c) {
					
					var str = args
						.splice(start, i - start + 1)
						.join(' ')
						.slice(1,  -1)
						;
					
					args.splice(start, 0, str);
					imax = args.length;
					break;
				}
			}
		}
		
		return args;
	}
	
	function cli_parseArguments(argv){
		var imax = argv.length,
			i = 0,
			params = {},
			args = [],
			key, val, x;
		
		for (; i < imax; i++){
			x = argv[i];
			
			if (x[0] === '-') {
				
				key = x.replace(/^[\-]+/, '');
				
				if (i < imax - 1 && argv[i + 1][0] !== '-') {
					val = argv[i + 1];
					i++;
				} else {
					val = true;
				}
				
				params[key] = val;
				continue;
			}
			
			args.push(x);
		}
		
		return {
			path: args,
			query: params
		};	
	}

}());
