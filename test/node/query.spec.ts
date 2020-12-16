import { query_deserialize } from '../../src/utils/query';

UTest({
    'parse array' () {
        let arr = [
            {
                path: 'letters[]=a&letters[]=b',
                expect: {
                    letters: ['a', 'b']
                }
            },
        ];

        arr.forEach(test => {

            let query = query_deserialize(test.path);
            deepEq_(query, test.expect);
        })
    }
})
