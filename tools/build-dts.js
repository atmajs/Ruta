var dts = require('dts-bundle');

dts.bundle({
	name: 'ruta',
	main: './ts-temp/export.d.ts',
	out: './typings/index.d.ts'
});

io.File.copyTo('./ts-temp/typings/index.d.ts', './lib/ruta.d.ts');