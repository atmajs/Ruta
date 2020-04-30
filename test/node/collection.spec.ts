import Collection from '../../src/route/RouteCollection'

UTest({
    'simple' () {

        const routes = new Collection();

        routes.add('/user/:id', { foo: true });

        const path = '/user/20?a=xyz';
        const obj = routes.get(path);

        is_(obj, 'Object');
        deepEq_(obj.current, {
            path: path,
            params: { id: 20, a: 'xyz' }
        });
        deepEq_(obj.value, { foo: true });
    }
})
