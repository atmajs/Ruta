import ruta from '../../src/ruta'

UTest({
    'location'() {

        ruta.add('/user/:id', assert.callback(function (data) {
            eq_(data.current.params.id, 'bob');
        }));

        ruta.navigate('/user/bob');
        let stack = ruta.getBackStack();
        is_(stack, Array);
        eq_(stack.length, 1);
        has_(stack[0].url, '/utest/');
    },

    $after() {
        history.pushState({}, null, '/utest/');
    }
})
