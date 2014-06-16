var log_error;
(function(){
	
	log_error = function(){
		var args = _Array_slice.call(arguments);
		
		console.error.apply(console, ['Ruta'].concat(args));
	};
	
}());