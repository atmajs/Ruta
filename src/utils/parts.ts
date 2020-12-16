import { query_deserialize, query_serialize } from './query'
import { path_split, path_join } from './path'

export interface UrlSegments {
    path: string[]
    query: {
        [key: string]: string
    }
}

/**
 *    '/foo/bar?a=b' =>
 *    { path: ['foo', 'bar'], query: { a: 'b' } }
 */
export function parts_serialize(parts: UrlSegments) {
    var path = path_join(parts.path);

    if (parts.query == null)
        return path;

    return path
        + '?'
        + query_serialize(parts.query, '&')
        ;
};

export function parts_deserialize(url: string): UrlSegments {
    var query = url.indexOf('?'),
        path = query === -1
            ? url
            : url.substring(0, query);

    return {
        path: path_split(path),
        query: query === -1
            ? null
            : query_deserialize(url.substring(query + 1), '&')
    };
};
