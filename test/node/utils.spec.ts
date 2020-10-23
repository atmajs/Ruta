import { path_setQuery } from '../../src/utils/path'

UTest({
    'serialize query' () {
        let str = path_setQuery('/foo', { bar: 'b'});
        eq_(str, '/foo?bar=b');
    }
})
