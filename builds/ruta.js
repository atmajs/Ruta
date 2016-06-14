(function(root, factory){
	"use strict";

	var isNode = (typeof window === 'undefined' || window.navigator == null);
	var global_ = isNode ? global : window;

	function construct(){
		var ruta = factory(global_);
		if (isNode) {
			module.exports = ruta;
			return;
		}
		return window.ruta = ruta;
	}

	if (typeof define === 'function' && define.amd) {
		return define(construct);
	}

	return construct();
}(this, function(global){
	"use strict";

	// import ../src/vars.js

	// import ../src/utils/obj.js
	// import ../src/utils/log.js
	// import ../src/utils/path.js
	// import ../src/utils/query.js
	// import ../src/utils/rgx.js
	// import ../src/utils/parts.js

	// import ../src/route/exports.js

	// import ../src/emit/exports.js

	// import ../src/api/utils.js
	// import ../src/ruta.js

	// import ../src/mask/attr/anchor-dynamic.js

	return Ruta;
}));