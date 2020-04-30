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
    // export function last () {
    // 	return stack.length === 1 
    // 		? null 
    // 		: stack[stack.length - 2]
    // 		;
    // }
    // export function next () {
    // 	return forwardStates[0];
    // }
    // export function isLast(id: number) {
    // 	let x = last();
    // 	return id != null && x != null && x.id === id;
    // }
    // export function findLastIndex(id: number) {
    // 	let i = backStates.length;
    // 	while(--i > -1) {
    // 		if (backStates[i].id == id) {
    // 			return i;
    // 		}
    // 	}
    // 	return -1;
    // }
    // export function findNextIndex(id: number) {
    // 	let i = -1;
    // 	while(++i < forwardStates.length) {
    // 		if (forwardStates[i].id == id) {
    // 			return i;
    // 		}
    // 	}
    // 	return -1;
    // }
    // export function isNext(id: number) {
    // 	let x = next();
    // 	return id != null && x != null && x.id === id;
    // }
    // export function pop (count = 1) {
    // 	return stack.splice(stack.length - count);
    // }
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
}

export interface IState {
    id: string
    url: string
    [key: string]: any
};