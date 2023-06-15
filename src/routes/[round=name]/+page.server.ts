import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const prerender = 'auto';
export const load = (async ({ params, parent }) => {
	const { rounds } = await parent();
	const matchingRound = rounds.find((round) => round.slug === params.round);
	if (matchingRound) return matchingRound;

	throw error(404);
}) satisfies PageServerLoad;
