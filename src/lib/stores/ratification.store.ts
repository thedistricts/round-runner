import type { LngLatLike } from 'maplibre-gl';
import { writable, derived } from 'svelte/store';
import type { RatificationResults, FilteredRatificationResults } from './ratification.store.d';
import { VALIDITY } from '$lib/enum';

function createRatification() {
	const ratification = writable<RatificationResults>([]);

	const { subscribe, set, update } = ratification;

	return {
		subscribe,
		set,
		update,
		reset: () => set([]),
	};
}

export const ratification = createRatification();

export const results = derived(ratification, ($ratification) => {
	const ratificationResults: FilteredRatificationResults = {
		valids: undefined,
		invalids: undefined,
		warnings: undefined
	};

	ratificationResults.valids = $ratification.filter(
		(feature) => feature.properties.valid === VALIDITY.VALID
	);
	ratificationResults.invalids = $ratification.filter(
		(feature) => feature.properties.valid === VALIDITY.FAIL
	);
	ratificationResults.warnings = $ratification.filter(
		(feature) => feature.properties.valid === VALIDITY.WARN
	);

	return ratificationResults;
});

export const resultsFocus = writable<LngLatLike>(undefined);
