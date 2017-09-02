export function obj_extend (a: object, b: object){
	if (b == null)
		return a || {};
	
	if (a == null)
		return obj_create(b);
	
	for(var key in b){
		a[key] = b[key];
	}
	return a;
};

export function obj_default (a: object, b: object) {
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

let obj_create = Object.create || function(x) {
	var Ctor = function(){};
	Ctor.prototype = x;
	return new Ctor;
};
export { obj_create }