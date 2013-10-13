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
	
	// import ../src/vars.js
	// import ../src/utils/path.js
	// import ../src/utils/query.js
	// import ../src/utils/rgx.js

	// import ../src/route/Collection.js

	// import ../src/emit/Location.js
	// import ../src/ruta.js
	
	// import ../src/mask/attr/anchor-dynamic.js
	
	return Ruta;
}));