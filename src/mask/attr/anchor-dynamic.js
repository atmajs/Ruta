

(function() {
	
		
	mask.registerAttrHandler('x-dynamic', function(node, value, model, cntx, tag){
		
		tag.onclick = navigate;
		
	}, 'client');
	
	function navigate(event) {
		event.preventDefault();
		event.stopPropagation();
		
		Ruta.navigate(this.href);
	}
	
}());
