import { LocationNavigateOptions } from '../emit/ILocationSource';

export function getStep (opts: LocationNavigateOptions) {
    if (opts == null) return 1;
    if (opts.replace === true) return 0;
    if (opts.step != null) return opts.step;
    return 1;
};
export function setProperty (opts: LocationNavigateOptions, key: string, val: any) {
    let x = opts || {};
    x[key] = val;
    return x;
}