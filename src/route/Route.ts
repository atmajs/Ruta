import {route_parseDefinition} from './route_utils'
import options from '../options'

export default class Route {
	method: string
	strict: boolean = options.isStrict
	current: any
	query: {[key: string]: any}
	path: string

	constructor (public definition: string, public value: string | any = null) {
		var def = definition;
		if (def.charCodeAt(0) === 36) {
			var i = def.indexOf(' ');
			this.method = def.substring(1, i).toUpperCase();
			def = def.substring(i + 1);
		}		
		route_parseDefinition(this, def);
	}
};