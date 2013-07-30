function HashEmitter(listener) {

	if (typeof window === 'undefined' || 'onhashchange' in window === false)
		return null;


	var that = this;

	that.listener = listener;

	window.onhashchange = function() {
		that.changed(location.hash);
	}

	return that;
}

(function() {
	
	function hash_normalize(hash) {
		return hash.replace(/^[!#/]+/, '/');
	}
	
	HashEmitter.prototype = {
		navigate: function(hash) {
			
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