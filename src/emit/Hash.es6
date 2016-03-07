class HashEmitter {
	constructor (listener) {
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
		this.changed(location.hash);
	}

	navigate (hash) {
		if (hash == null) {
			this.changed(location.hash);
			return;
		}

		location.hash = hash;
	}

	changed (hash) {
		this
			.listener
			.changed(HashEmitter.normalizeHash(hash));
	}

	current () {
		return HashEmitter.normalizeHash(location.hash);
	}
}