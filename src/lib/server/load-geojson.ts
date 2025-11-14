import { readFileSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { PageData } from '../../routes/[round=name]/$types';
import type { RouteGeoJson } from '../stores/route.store.d';

export async function loadGeojson(
	params: { round: string },
	rounds: PageData['rounds']
): Promise<PageData['rounds'][number] & { slug: string; geojson: RouteGeoJson }> {
	const matchingRound = rounds.find((round: PageData['rounds'][number]) => round.slug === params.round);

	if (!matchingRound) {
		throw error(404);
	}

	// Load geojson during SSR/prerender
	// The json path in manifest is like "/data/frog-graham-cw.geo.json"
	// We need to read from static/data/ directory
	const jsonPath = matchingRound.json.replace(/^\//, ''); // Remove leading slash
	const geojsonPath = join(process.cwd(), 'static', jsonPath);

	let geojson: RouteGeoJson;
	try {
		const fileContent = readFileSync(geojsonPath, 'utf-8');
		geojson = JSON.parse(fileContent) as RouteGeoJson;
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		console.error(`Failed to load geojson for ${params.round}:`, errorMessage);
		throw error(500);
	}

	return {
		...matchingRound,
		slug: params.round,
		geojson
	};
}

