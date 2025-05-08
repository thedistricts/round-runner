import type { EntryGenerator } from './$types';
import manifast from '$lib/data/round-manifest.json';

export const entries: EntryGenerator = () => {
	return manifast.rounds.map((round) => ({ round: round.slug }));
};

export const prerender = true;
