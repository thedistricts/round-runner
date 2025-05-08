import { error } from '@sveltejs/kit';

export const prerender = true;

export const load = (async ({ params, parent }) => {
	const { rounds } = await parent();

	const matchingRound = rounds.find((round) => round.slug === params.round);

	if (matchingRound) return { ...matchingRound, slug: params.round };

	throw error(404);
});
