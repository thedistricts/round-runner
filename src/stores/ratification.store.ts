import { writable } from 'svelte/store';
import type { RatificationResults } from './ratification.store.d';

export const route = writable<RatificationResults>([]);

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
