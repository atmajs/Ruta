import LocationEmitter from './LocationEmitter'


export class LocationNavigateOptions {
    /**
     * History step. 1: Forward, 0: Replace Current, -1-(-n): Back 
     * @default: 1 
     * */
    step?: number = 1
    /**
     * Backcompat.
     * @deprecated Use `step:0`
     */
    replace?: boolean = false
    /** When true and query arguments are used, than navigation extends current query */
    extend?: boolean = false
    /** When false listeners are not notified */
    silent?: boolean = false
    /** Additional arguments which will be attached to the routes model params */
    params?: any = null    
}

export class LocationBackOptions {
    default?: {
        url: string
        opts?: LocationNavigateOptions
    }
}

export interface ILocationSource {
    navigate (path: object | string, opts?: LocationNavigateOptions)
    back()
    forward ()
    current (): string
}
