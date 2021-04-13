import { RouteCollection } from '../../src/route/RouteCollection'

const routes = new RouteCollection();

UTest({
    'add+get'() {

        routes
            .clear()
            .add('/note/:id/:action(edit|delete)', { foo: 'bar' });

        var got = routes.get('/note/524d66bccc0ac4d8913eaea5/edit?x=y');

        eq_(got.value.foo, 'bar');
        eq_(got.current.params.id, '524d66bccc0ac4d8913eaea5');
        eq_(got.current.params.action, 'edit');
        eq_(got.current.params.x, 'y');


        routes
            .clear()
            .add('/install/:name?:global(glob|g)', { foo: 'bar' });

        var got = routes.get('/install/loader?glob=baz');

        notEq_(got, null);
        eq_(got.current.params.global, 'baz');


        routes
            .clear()
            .add('/install/:name??:global(glob|g)', { foo: 'bar' });
        var got = routes.get('/install/loader?qux=baz');

        notEq_(got, null);
        eq_(got.current.params.qux, 'baz');
        eq_(got.current.params.global, null);

        routes
            .clear()
            .add('/install/:name??:global(glob|g)', { foo: 'bar' });

        var got = routes.get('/install/loader?qux=baz&g=foo');

        notEq_(got, null);
        eq_(got.current.params.qux, 'baz');
        eq_(got.current.params.global, 'foo');
    },


})
