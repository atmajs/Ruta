
function rgx_fromString(str, flags) {
	return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), flags);
}

/**
 *  Url part should be completely matched, so add ^...$
 */
function rgx_aliasMatcher(str){
	
	if (str[0] === '^') 
		return new RegExp(str);
	
	var groups = str.split('|');
	for (var i = 0, imax = groups.length; i < imax; i++){
		groups[i] = '^' + groups[i] + '$';
	}
	
	return new RegExp(groups.join('|'));
}

