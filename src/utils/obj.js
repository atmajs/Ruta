var obj_extend,
	obj_create,
	obj_default;
(function(){
	
	obj_extend = function(a, b){
		if (b == null)
			return a || {};
		
		if (a == null)
			return obj_create(b);
		
		for(var key in b){
			a[key] = b[key];
		}
		return a;
	};

	obj_default = function(a, b) {
		if (b == null)
			return a || {};
		
		if (a == null)
			return obj_create(b);
		
		for(var key in b){
			if (a[key] == null) {
				a[key] = b[key];	
			}
		}
		return a;
	};
	
	obj_create = Object.create || function(x) {
		var Ctor = function(){};
		Ctor.prototype = x;
		return new Ctor;
	};
	
}());