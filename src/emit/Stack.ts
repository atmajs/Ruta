export namespace Stack {
    let time = Date.now();
    let uuid = 1;

    export const stack: IState[] = [];
    export const forwardStates: IState[] = [];

    export function create(url: string): IState {
        return {
            id: `${time}_${++uuid}`,
            url
        };
    }
    export function push(current: IState) {
        stack.push(current);
        forwardStates.length = 0;
    }
    export function replace(current: IState) {
        stack[Math.max(0, stack.length - 1)] = current;
    }
    export function goBackById(id: string): number {
        let i = stack.length;
        while (--i > -1) {
            if (stack[i].id !== id) {
                continue;
            }
            let count = stack.length - (i + 1);
            goBackByCount(count);
            return -count;
        }
        return 0;
    }
    export function goBackByCount(count: number) {
        let arr = stack.splice(stack.length - count);

        forwardStates.unshift(...arr);
    }
    export function goForwardById(id: string): number {
        for (let i = 0; i < forwardStates.length; i++) {
            if (forwardStates[i].id !== id) {
                continue;
            }
            let count = i + 1;
            goForwardByCount(count);
            return count;
        }
        return 0;
    }
    export function goForwardByCount(count: number) {
        let arr = forwardStates.splice(0, count);
        stack.push(...arr);
    }

    // export function setForwards (states: State[]) {
    // 	forwardStates.unshift(...states);
    // }
    // export function goForward () {
    // 	backStates.push(forwardStates.shift());
    // }
    export function hasBack() {
        return stack.length > 1;
    }
    export function hasForwad() {
        return forwardStates.length > 0;
    }
    export function getCurrent() {
        return stack.length === 0 ? null : stack[stack.length - 1]
    }
    export function getBackStack() {
        return stack.length === 0 ? [] : stack.slice(0, stack.length - 1);
    }
    export function findInBack (url: string): IState {
        for (let i = stack.length - 1; i > -1; i--) {
            if (stack[i].url === url) {
                return stack[i];
            }
        }
        return null;
    }
}

export interface IState {
    id: string
    url: string
    [key: string]: any
};
