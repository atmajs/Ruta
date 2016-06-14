// import parse.js
// import match.js

class Route {
	constructor (definition, value) {
		this.method = null;
		var def = definition;
		if (def.charCodeAt(0) === 36) {
			var i = def.indexOf(' ');
			this.method = def.substring(1, i).toUpperCase();
			def = def.substring(i + 1);
		}

		this.value = value;
		this.strict = _cfg_isStrict;
		this.definition = definition;
		this.current = null;
		this.query = null;
		this.path = null;

		route_parseDefinition(this, def);
	}
};