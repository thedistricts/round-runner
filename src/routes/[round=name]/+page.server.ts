import type { EntryGenerator } from './$types';
import type { PageData } from '../$types';
import manifast from '$lib/data/round-manifest.json';
import { loadGeojson } from '$lib/server/load-geojson';
import type { RouteGeoJson } from '$lib/stores/route.store.d';

export const entries: EntryGenerator = () => {
	return manifast.rounds.map((round) => ({ round: round.slug }));
};

export const prerender = true;

export const load = async ({ params, parent }): Promise<PageData['rounds'][number] & { slug: string; geojson: RouteGeoJson }> => {
	const { rounds } = await parent();
	return await loadGeojson(params, rounds);
};
