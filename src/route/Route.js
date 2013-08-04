
// import parse.js
// import match.js

var regexp_var = '([^\\\\]+)';

function Route(definition, value) {

	this.value = value;
	this.definition = definition;
	
	route_parseDefinition(this, definition);
}

Route.prototype = {
	parts: null,
	value: null,
	current: null
};
