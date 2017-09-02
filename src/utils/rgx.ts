import {log_error} from './log'

export function rgx_fromString(str, flags) {
	return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), flags);
};

/**
 *  Url part should be completely matched, so add ^...$ and create RegExp
 */

export function rgx_aliasMatcher(str) {

	if (str[0] === '^') 
		return new RegExp(str);

	var groups = str.split('|');
	for (var i = 0, imax = groups.length; i < imax; i++) {
		groups[i] = '^' + groups[i] + '$';
	}

	return new RegExp(groups.join('|'));
};

/**
 * :debugger(d|debug) => { alias: 'debugger', matcher: RegExp }
 */
export function rgx_parsePartWithRegExpAlias(str) {
	var pStart = str.indexOf('('),
		pEnd = str.lastIndexOf(')')
		;

	if (pStart === -1 || pEnd === -1) {
		log_error('Expected alias part with regexp', str);
		return null;
	}

	var rgx = str.substring(pStart + 1, pEnd);
	return {
		alias: str.substring(1, pStart),
		matcher: rgx_aliasMatcher(rgx)
	};
};

