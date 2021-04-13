import { getStep } from '../utils/navigation';
import { ILocationSource, LocationNavigateOptions } from './ILocationSource'
import { LocationEmitter } from './LocationEmitter'

export default class MemoryEmitter implements ILocationSource {
    stack: string[] = ['/']
    forwardStack: string[] = []
    constructor(public listener: LocationEmitter) {

    }
    navigate(path: string, opts?: LocationNavigateOptions) {
        let step = getStep(opts);
        if (step < 1) {
            let arr = this.stack.splice(step - 1);
            this.forwardStack.unshift(...arr);
        } else {
            this.forwardStack.length = 0;
        }
        this.stack.push(path);
        this.listener.onChanged(path, opts);
    }
    current(): string {
        return this.stack[this.stack.length - 1]
    }
    back() {
        this.forwardStack.unshift(this.stack.pop());
        let opts = new LocationNavigateOptions();
        opts.step = -1;
        this.listener.onChanged(this.current(), opts);
    }
    forward() {
        this.stack.push(this.forwardStack.shift());
        let opts = new LocationNavigateOptions();
        opts.step = 1;
        this.listener.onChanged(this.current(), opts);
    }
}
