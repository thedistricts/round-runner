import type { RatifyReturn } from '$lib/workers/ratification.worker.d';
export type RatificationResults = RatifyReturn;

type FilteredRatificationResults = {
	valids?: RatifyReturn;
	invalids?: RatifyReturn;
	warnings?: RatifyReturn;
};
