import { LocationEmitter } from './LocationEmitter'
import { Route }from '../route/Route'
import { route_match } from '../route/match'
import { LocationNavigateOptions } from './ILocationSource';

export default class Lifecycle {
    route: Route
    state: ILifeCycleEvent
    constructor (public location: LocationEmitter, public definition: string, public callback: (ILifeCycleEvent) => void) {
        this.changed = this.changed.bind(this);
        this.location.on('^/', this.changed);
        this.route = new Route(definition);

        let current = route_match(this.location.currentPath(), [ this.route ]);

        this.state = {
            type: EventType.Initial,
            direction: Direction.Forward,
            route: current
        };
        this.callback(this.state);
    }
    changed (route: Route, opts: LocationNavigateOptions) {
        this.state.direction = opts.step < 0
            ? Direction.Back
            : Direction.Forward
            ;

        let state = this.state;
        let current = route_match(this.location.currentPath(), [ this.route ]);
        if (current == null) {
            if (this.state.route == null) {
                return;
            }
            state.type  = EventType.Leave;
            state.route = null;
            this.callback(state);
            return;
        }
        if (this.state.route == null) {
            state.type  = EventType.Enter;
            state.route = current;
            this.callback(state);
            return;
        }
        state.type  = EventType.Change;
        state.route = current;
        this.callback(state);
    }
    dispose () {
        this.location.off('^/', this.changed);
    }
}

export enum EventType {
    Initial = 'initial',
    Enter = 'enter',
    Leave = 'leave',
    Change = 'change'
};
export enum Direction {
    Forward = 'forward',
    Back = 'back'
}

export interface ILifeCycleEvent {
    type: EventType,
    direction: Direction,
    route: Route
}
