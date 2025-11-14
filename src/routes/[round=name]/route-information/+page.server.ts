import type { EntryGenerator } from './$types';
import manifast from '$lib/data/round-manifest.json';
import { readFileSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { PageData } from '../$types';

export const entries: EntryGenerator = () => {
	return manifast.rounds.map((round) => ({ round: round.slug }));
};

export const prerender = true;

export const load = async ({ params, parent }) => {
	const { rounds } = await parent();
	const matchingRound = rounds.find((round: PageData['rounds'][number]) => round.slug === params.round);

	if (!matchingRound) {
		throw error(404);
	}

	// Load geojson during SSR/prerender
	// The json path in manifest is like "/data/frog-graham-cw.geo.json"
	// We need to read from static/data/ directory
	const jsonPath = matchingRound.json.replace(/^\//, ''); // Remove leading slash
	const geojsonPath = join(process.cwd(), 'static', jsonPath);
	
	let geojson;
	try {
		const fileContent = readFileSync(geojsonPath, 'utf-8');
		geojson = JSON.parse(fileContent);
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
};
