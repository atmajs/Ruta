

(function() {
	
		
	mask.registerAttrHandler('x-dynamic', function(node, value, model, cntx, tag){
		
		tag.onclick = navigate;
		
	}, 'client');
	
	function navigate(event) {
		event.preventDefault();
		event.stopPropagation();
		
		ruta.navigate(this.href);
	}
	
}());
