import { mask, Ruta } from './globals'

if (mask) {
	mask.registerAttrHandler('x-dynamic', function(node, value, model, ctx, tag){
		tag.onclick = navigate;
	}, 'client');

	function navigate(event) {
		event.preventDefault();
		event.stopPropagation();

		Ruta.navigate(this.getAttribute('href'));
	}
}