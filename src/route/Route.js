
// import parse.js
// import match.js

var regexp_var = '([^\\\\]+)';

function Route(definition, value) {
	
	this.method = definition.charCodeAt(0) === 36
		? definition.substring(1, definition.indexOf(' ')).toUpperCase()
		: null
		;
	
	if (this.method != null) {
		definition = definition.substring( this.method.length + 2 );
	}
	
	this.strict = _cfg_isStrict;
	this.value = value;
	this.definition = definition;
	
	route_parseDefinition(this, definition);
}

Route.prototype = {
	path: null,
	query: null,
	value: null,
	current: null
};
