class HashEmitter {
	constructor (listener) {
		this.opts = null;
		this.listener = listener;
		window.onhashchange = this.onhashchange.bind(this)
	}

	static supports () {
		if (typeof window === 'undefined' || 'onhashchange' in window === false)
			return false;

		return true;
	}
	static normalizeHash(hash) {
		return hash.replace(/^[!#/]+/, '/');
	}

	onhashchange () {
		this.changed();
	}

	navigate (hash, opts) {
		this.opts = opts;
		
		if (hash == null) {
			this.changed();
			return;
		}
		location.hash = hash;
	}

	changed (opts_) {
		var opts = opts_ || this.opts; 
		this.opts = null;
		this.listener.changed(this.current(), opts);
	}

	current () {
		return HashEmitter.normalizeHash(location.hash);
	}
}