var Location;
(function(){

	if (typeof window === 'undefined') {
		Location = function(){};
	}

	// import Hash.es6
	// import History.es6
	// import LocationEmitter.es6

	Location = LocationEmitter;
}());