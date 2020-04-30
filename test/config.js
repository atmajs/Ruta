module.exports = {
    $config: {
        $before() {
            process.on('unhandledRejection', (...args) => {
                console.log(args);
            });
            process.on('uncaughtException', (...args) => {
                console.log(args);
            });

            include
                .cfg('extentionDefault', { js: 'ts' })
                .cfg('amd', true);
        }
    },
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