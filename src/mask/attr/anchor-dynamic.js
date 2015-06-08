(function() {
	if (mask == null) {
		return;
	}
	
	mask.registerAttrHandler('x-dynamic', function(node, value, model, ctx, tag){
		tag.onclick = navigate;
	}, 'client');
	
	function navigate(event) {
		event.preventDefault();
		event.stopPropagation();
		
		Ruta.navigate(this.href);
	}
}());
