export namespace Stack {
	let uuid = 1;
	export const backStates = [];
	export const forwardStates = [];
	
	export function create (url: string) {
		return { 
            id: ++uuid,
            url
        };
	}
	export function push (x) {
		backStates.push(x);
		forwardStates.length = 0;
	}
	export function replace (x) {
		backStates[Math.max(0, backStates.length - 1)] = x;
	}
	export function last () {
		return backStates.length === 0 
			? null 
			: backStates[backStates.length - 1]
			;
	}
	export function next () {
		return forwardStates[0];
	}
	export function isLast(id: number) {
		let x = last();
		return id != null && x != null && x.id === id;
	}
	export function isNext(id: number) {
		let x = next();
		return id != null && x != null && x.id === id;
	}
	export function pop () {
		return backStates.pop();
	}
	export function setForward (state) {
		forwardStates.unshift(state);
	}
	export function goForward () {
		backStates.push(forwardStates.shift());
    }
    export function hasBack () {
        return backStates.length > 0;
    }
    export function hasForwad () {
        return forwardStates.length > 0;
    }
}

