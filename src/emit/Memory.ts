import { ILocationSource } from './ILocationSource'
import LocationEmitter from './LocationEmitter'

export default class MemoryEmitter implements ILocationSource {
    stack: string[] = [ '/' ]
    constructor(public listener: LocationEmitter) {
		
	}
    navigate(path: string, opts?: any) {
        this.stack.push(path);
        this.listener.changed(path, opts);
    }
    current(): string {
        return this.stack[this.stack.length - 1]
    }
}