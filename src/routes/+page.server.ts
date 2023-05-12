import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const prerender = true;
export const load = (async ({ parent }) => {
	const { rounds } = await parent();
	const defaultRound = rounds.find((round) => round.default === true);

	throw redirect(307, `/${defaultRound?.slug}`);
}) satisfies PageServerLoad;
