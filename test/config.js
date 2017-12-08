module.exports = {
	suites: {		
		dom: {
			env: '/lib/ruta.js',
			tests: ['/test/dom/**.test'],	
			$config: {
				includejs: {
					extentionDefault: { js: 'ts' },
					amd: true
				}
			}
		},
		node: {
			env: '/lib/ruta.js',
			tests: ['/test/node/**.test']
		}
	}
	
};