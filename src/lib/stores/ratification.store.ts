import { writable } from 'svelte/store';
import type { RatificationResults } from './ratification.store.d';

function createRatification() {
	const { subscribe, set, update } = writable<RatificationResults>([]);

	return {
		subscribe,
		set,
		update,
		reset: () => set([])
	};
}

export const ratification = createRatification();
