import { writable } from 'svelte/store';
function create() {
	const breakdown = writable<boolean>(false);

	const { subscribe, set, update } = breakdown;

	return {
		subscribe,
		set,
		update,
		reset: () => set(false),
	};
}

export const breakdown = create();