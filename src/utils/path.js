function path_normalize(str) {
	
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
}

function path_split(path) {
	path = path_normalize(path);
	
	return path === ''
		? []
		: path.split('/');
}

function path_join(pathParts) {
	return '/' + pathParts.join('/');
}

