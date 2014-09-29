function HashEmitter(listener) {
	if (typeof window === 'undefined' || 'onhashchange' in window === false)
		return null;

	this.listener = listener;
	
	var that = this;
	window.onhashchange = function() {
		that.changed(location.hash);
	};
	return this;
}

(function() {
	
	function hash_normalize(hash) {
		return hash.replace(/^[!#/]+/, '/');
	}
	
	HashEmitter.prototype = {
		navigate: function(hash) {
			if (hash == null) {
				this.changed(location.hash);
				return;
			}
			
			location.hash = hash;
		},
		changed: function(hash) {
			this
				.listener
				.changed(hash_normalize(hash));
				
		},
		current: function() {
			return hash_normalize(location.hash);
		}
	};

}());