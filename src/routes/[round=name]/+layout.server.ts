import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params, parent }) => {
	const { rounds } = await parent();
	const matchingRound = rounds.find((round) => round.slug === params.round);

	if (matchingRound) return {...matchingRound };

	throw error(404);
});
