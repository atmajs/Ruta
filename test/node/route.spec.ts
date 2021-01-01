import { Route } from '../../src/route/Route'
import { route_isMatch } from '../../src/route/match'
import { route_parsePath } from '../../src/route/route_utils'
import { path_fromCLI } from '../../src/utils/path'



function check(definition, data) {
    var route = new Route(definition),
        matches = data.match,
        falsies = data.fail;

    if (matches) {
        for (var i = 0, x, y, matched, imax = matches.length; i < imax; i++) {
            x = matches[i];

            if (typeof x === 'string') {
                y = 0;
            } else {
                y = x[1];
                x = x[0];
            }

            matched = route_isMatch(x, route);
            eq_(matched, true, x);

            if (matched && y) {
                deepEq_(y, route_parsePath(route, x).params);
            }
        }
    }

    if (falsies) {
        for (var i = 0, x, imax = falsies.length; i < imax; i++) {
            x = falsies[i];
            eq_(route_isMatch(x, route), false, x);
        }
    }

    if (data.method) {
        eq_(route.method, data.method);
    }
}


UTest({

    'simple' () {
        check('/user/:id', {
            match: [
                ['/user/20', { id: 20 }],
                ['/user/bob/', { id: 'bob' }],
                ['user/bob/?age=27', { id: 'bob', age: 27 }],
                ['user/bob?age=27', { id: 'bob', age: 27 }]
            ],
            fail: [
                '/user/10/remove',
                '/user',
                '/user/',
                '/users/10',
                '/x/user/20'
            ]
        });

        check('/user/:id/?:action', {
            match: [
                ['/user/20/remove', { id: 20, action: 'remove' }],
                ['/user/bob', { id: 'bob' }]
            ]
        })

        check('/:page/:tab/:anchor', {
            match: [
                ['/mask/api/simple', { page: 'mask', tab: 'api', anchor: 'simple' }],
            ]
        });

        check('/?foo', {
            match: [
                ['/foo?a=b', { a: 'b' }],
                ['/?c=d', { c: 'd' }],
            ],
            fail: [
                '/fooz',
                '/afoo',
                '/b/foo'
            ]
        })
    },
    'any' () {
        check('/*/foo', {
            match: [
                ['/service/foo', {}],
                ['/baz/foo?action=remove', { action: 'remove' }]
            ],
            fail: [
                '/foo',
                '/zfoo',
                '/fooz'
            ]
        });
        check('/*/*/foo', {
            match: [
                ['/service/qux/foo', {}]
            ],
            fail: [
                '/foo/foo'
            ]
        });
    },
    'conditional' () {
        check('/service/:action(save|remove)', {
            match: [
                ['/service/save', { action: 'save' }],
                ['/service/remove', { action: 'remove' }]
            ],
            fail: [
                '/service/delete',
                '/service/savex',
                '/service/aremove'
            ]
        });
    },
    'strict' () {
        check('!/user/:id', {
            match: [
                '/user/20',
                ['/user/20?some=value', { id: 20, some: 'value' }]
            ],
            fail: [
                '/user/20/some'
            ]
        });

        check('!/', {
            match: ['/'],
            fail: ['/tv']
        });
    },

    'method parser' () {

        check('$post !/:action(save)', {
            match: [
                ['/save', { action: 'save' }]
            ],
            fail: ['/remove'],
            method: 'POST'
        });

    },

    'regex' () {
        check('^/:alias(^num[0-9]{1,2}$)', {
            match: [
                ['/num10', { alias: 'num10' }],
                ['/num1', { alias: 'num1' }],
                ['/num0/num2', { alias: 'num0' }]
            ],
            fail: [
                '/num100',
                '/numx',
                '/numer']
        });

        check('(\\.less$)', {
            match: [
                ['/style/main.less']
            ],
            fail: [
                '/aless'
            ]
        });

        check('^/api/cms/(foo|bar)', {
            match: [
                ['/api/cms/foo'],
                ['/api/cms/bar']
            ],
            fail: [
                '/api/cms/lorem',
                '/api/cms/xfoo',
                '/api/cms/foox',
            ]
        });

        check('^/lorem/(?=(foo|bar))', {
            match: [
                ['/lorem/foo'],
                ['/lorem/bar']
            ],
            fail: [
                '/lorem/lorem',
                '/lorem/xfoo',
                '/lorem/foox',
            ]
        });
    },

    'query' () {

        check('?debug', {
            match: [
                '/some/path?debug',
                ['/some/path?foo=bar%20baz&debug', {
                    foo: 'bar baz',
                    debug: ''
                }],
                ['/some/path?foo&debug=bar', {
                    foo: '',
                    debug: 'bar'
                }]
            ],
            fail: [
                '/debug/path/debug?debugger'
            ]
        });

        check('?debug=js', {
            match: [
                '/some/path?debug=js',
                '/some/path?foo=bar&debug=js'
            ],
            fail: [
                '/debug/path/debug?debug&debug=jss'
            ]
        });

        check('/:action/:part?debug=(js|less)', {
            match: [
                ['/some/path?debug=js', {
                    action: 'some',
                    part: 'path',
                    debug: 'js'
                }],
                ['/some/path?foo=bar&debug=less', {
                    action: 'some',
                    part: 'path',
                    debug: 'less',
                    foo: 'bar'
                }],
                ['/some/path?foo&debug=less', {
                    action: 'some',
                    part: 'path',
                    debug: 'less',
                    foo: ''
                }]
            ],
            fail: [
                '/debug/path/debug?debug=less',
                '/debug?debug=js',
                '/debug/?debug=js',
                '/some/path?debug=lesser',
                '/debug/path/debug?debug=someless'
            ]
        });
    },

    'cli-parser' () {

        [
            ['custom test --debug', '/custom/test?debug'],
            ['test -debug value foo', '/test/foo?debug=value'],
            ['test -debug "value foo"', '/test?debug=value%20foo'],
        ]
            .forEach(function (test) {
                eq_(path_fromCLI(test[0]), test[1]);
            });

    }

});

