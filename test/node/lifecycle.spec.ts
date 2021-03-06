import { LocationEmitter } from'../../src/emit/LocationEmitter'
import { RouteCollection } from '../../src/route/RouteCollection'
import sinon = require('sinon');

UTest({
    'should emit the lifecycle events' () {
        let location = new LocationEmitter(new RouteCollection(), 'memory');
        let cb = sinon.spy();
        location.onLifecycle('/event/:id', cb);

        eq_(cb.callCount, 1);

        var event = cb.args[0][0];
        eq_(event.type, 'initial');
        eq_(event.route, null);

        location.navigate('/foo');
        location.navigate('/event/10');

        eq_(cb.callCount, 2);
        var event = cb.args[1][0];
        eq_(event.type, 'enter');
        deepEq_(event.route.current.params, { id: 10 })


        location.navigate('/event/11');
        eq_(cb.callCount, 3);
        var event = cb.args[2][0];
        eq_(event.type, 'change');
        deepEq_(event.route.current.params, { id: 11 });

        location.navigate('/events');
        eq_(cb.callCount, 4);
        var event = cb.args[3][0];
        eq_(event.type, 'leave');
        eq_(event.route, null);

        location.navigate('/foo');
        location.navigate('/event/9');
        eq_(cb.callCount, 5);
        var event = cb.args[4][0];
        eq_(event.type, 'enter');
        deepEq_(event.route.current.params, { id: 9 });


        location.offLifecycle('/event/:id', cb);
        location.navigate('/event/9');
        location.navigate('/events');
        eq_(cb.callCount, 5);
    }
})
