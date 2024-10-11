import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
export const prerender = 'auto';
export const load = (async ({ params, parent, url }) => {
	const { rounds } = await parent();
	const matchingRound = rounds.find((round) => round.slug === params.round);

	if (matchingRound) return {...matchingRound, showInfo: params.info };

	throw error(404);
}) satisfies PageServerLoad;
