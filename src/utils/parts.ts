import { query_deserialize, query_serialize } from './query'
import { path_split, path_join } from './path'

export interface IUrlSegments {
    path: string[]
    query: {
        [key: string]: string
    }
}

/**
 *    '/foo/bar?a=b' =>
 *    { path: ['foo', 'bar'], query: { a: 'b' } }
 */
export function parts_serialize(parts: IUrlSegments) {
    let path = path_join(parts.path);

    if (parts.query == null)
        return path;

    return path
        + '?'
        + query_serialize(parts.query, '&')
        ;
};

export function parts_deserialize(url: string): IUrlSegments {
    let query = url.indexOf('?');
    let path = query === -1
        ? url
        : url.substring(0, query);

    return {
        path: path_split(path),
        query: query === -1
            ? null
            : query_deserialize(url.substring(query + 1), '&')
    };
};
