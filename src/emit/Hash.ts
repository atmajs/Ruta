import { ILocationSource, LocationNavigateOptions } from './ILocationSource'
import LocationEmitter from './LocationEmitter'

export default class HashEmitter implements ILocationSource {
	opts: LocationNavigateOptions = null
	
	constructor(public listener: LocationEmitter) {		
		window.onhashchange = this.onhashchange.bind(this);
	}

	static supports() {
		if (typeof window === 'undefined' || 'onhashchange' in window === false)
			return false;

		return true;
	}
	static normalizeHash(hash: string) : string {
		return hash.replace(/^[!#/]+/, '/');
	}

	onhashchange() {
		this.changed();
	}

	navigate(hash: string, opts: LocationNavigateOptions) {
		this.opts = opts;

		if (hash == null) {
			this.changed();
			return;
		}
		location.hash = hash;
	}

	changed(opts_?: LocationNavigateOptions) {
		var opts = opts_ || this.opts;
		this.opts = null;
		this.listener.onChanged(this.current(), opts);
	}

	current() {
		return HashEmitter.normalizeHash(location.hash);
	}
	back () {
		window.history.back();
	}
	forward () {
		window.history.forward();
	}
}