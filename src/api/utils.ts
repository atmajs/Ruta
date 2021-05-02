import {path_fromCLI, path_getQuery } from '../utils/path'
import {query_deserialize, query_serialize } from '../utils/query'

export default {
    /**
     * Format URI path from CLI command:
     * some action -foo bar === /some/action?foo=bar
     */
    pathFromCLI: path_fromCLI,

    query: {
        serialize: query_serialize,
        deserialize: query_deserialize,
        get (path_?) {
            let path = path_ == null
                ? location.search
                : path_;
            return path_getQuery(path);
        }
    }
};
