import type { ParamMatcher } from '@sveltejs/kit';
import manifast from '$lib/data/round-manifest.json';

export const match = ((param) => {
	return !!manifast.rounds.find((round) => round.slug === param);
}) satisfies ParamMatcher;
