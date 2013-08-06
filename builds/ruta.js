(function(root, factory){
	"use strict";
	
	if (root == null) {
		root = typeof window !== 'undefined' && typeof document !== 'undefined' 
			? window 
			: global;
	}
	
	
	root.ruta = factory(root);
	
}(this, function(global){
	"use strict";
	
	var mask = global.mask || Mask;
	
	// import ../src/utils/path.js
	// import ../src/utils/query.js

	// import ../src/route/Collection.js

	// import ../src/emit/Location.js
	// import ../src/ruta.js
	
	// import ../src/mask/attr/anchor-dynamic.js
	
	return Ruta;
}));