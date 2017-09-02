import LocationEmitter from './LocationEmitter'

export interface ILocationSource {
    navigate (path: string, opts?: any)
    current (): string
}