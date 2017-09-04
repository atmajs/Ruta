import LocationEmitter from './LocationEmitter'
import Route from '../route/Route'
import { route_match } from '../route/match'

export default class Lifecycle {
    route: Route
    state: ILifeCycleEvent
    constructor (public location: LocationEmitter, public definition: string, public callback: (ILifeCycleEvent) => void) {
        this.changed = this.changed.bind(this);
        this.location.on('^/', this.changed);
        this.route = new Route(definition);

        let current = route_match(this.location.currentPath(), [ this.route ]);
        
        this.state = {
            type: State.Initial,
            route: current
        };
        this.callback(this.state);
    }
    changed (route) {
        let state = this.state;
        let current = route_match(this.location.currentPath(), [ this.route ]);
        if (current == null) {
            if (this.state.route == null) {
                return;
            }
            state.type  = State.Leave;
            state.route = null;
            this.callback(state);
            return;
        }        
        if (this.state.route == null) {
            state.type  = State.Enter;
            state.route = current;
            this.callback(state);
            return;
        }        
        state.type  = State.Change;
        state.route = current;
        this.callback(state);
    }
    dispose () {
        this.location.off('^/', this.changed);
    }
}

const State = {
    Initial: 'initial',
    Enter: 'enter',
    Leave: 'leave',
    Change: 'change'
};

interface ILifeCycleEvent {
    type: string,
    route: Route
}