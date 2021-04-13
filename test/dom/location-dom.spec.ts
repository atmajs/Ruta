import { Ruta } from '../../src/ruta'

UTest({
    'location'() {

        Ruta.add('/user/:id', assert.callback(function (data) {
            eq_(data.current.params.id, 'bob');
        }));

        Ruta.navigate('/user/bob');
        let stack = Ruta.getBackStack();
        is_(stack, Array);
        eq_(stack.length, 1);
        has_(stack[0].url, '/utest/');
    },

    $after() {
        history.pushState({}, null, '/utest/');
    }
})
