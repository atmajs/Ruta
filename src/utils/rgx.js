var rgx_fromString,

	// Url part should be completely matched, so add ^...$ and create RegExp
	rgx_aliasMatcher,
	
	// :debugger(d|debug) => { alias: 'debugger', matcher: RegExp }
	rgx_parsePartWithRegExpAlias
	;

(function(){

	
	rgx_fromString = function(str, flags) {
		return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), flags);
	};
	
	rgx_aliasMatcher = function(str){
		
		if (str[0] === '^') 
			return new RegExp(str);
		
		var groups = str.split('|');
		for (var i = 0, imax = groups.length; i < imax; i++){
			groups[i] = '^' + groups[i] + '$';
		}
		
		return new RegExp(groups.join('|'));
	};

	rgx_parsePartWithRegExpAlias = function(str){
		var pStart = str.indexOf('('),
			pEnd = str.lastIndexOf(')')
			;
		
		if (pStart === -1 || pEnd === -1) {
			console.error('<ruta> Expected alias part with regexp', str);
			return null;
		}
		
		var rgx = str.substring(pStart + 1, pEnd);
		return {
			alias: str.substring(1, pStart),
			matcher: rgx_aliasMatcher(rgx)
		};
	};
	
}());
