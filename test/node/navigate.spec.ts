import Route from '../../src/route/Route'
import LocationEmitter from '../../src/emit/LocationEmitter'
import RouteCollection from '../../src/route/RouteCollection'
import sinon = require('sinon')

UTest({
    'navigate' () {
        let emitter = new LocationEmitter(new RouteCollection(), 'memory');
        let spy = sinon.spy();
        emitter.on('/test', spy);

        let qux = {};
        emitter.navigate('/test', {
            params: {
                foo: qux
            }
        });

        eq_(spy.callCount, 1);
        let route: Route = spy.args[0][0];

        eq_(route.current.params.foo, qux);
    }
})