import * as turf from '@turf/turf';
import { expose } from 'comlink';
import type { GPXGeoJson } from '../../stores/gpx.store.d';
import type { RouteGeoJson } from '../../stores/route.store.d';

interface RatifyProps {
	data: GPXGeoJson;
	route: RouteGeoJson;
}

export function ratify({ data, route }: RatifyProps) {
	// cycle through the route points test against route,
	// find the nearest, does it fall within the boundary?
	// do we have to cycle through them all?
	const lineStringFeature = data.features.find((feature) => feature.geometry.type === 'LineString');

	if (!lineStringFeature) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const routePoints = route.features.map((routePoints) =>
		turf.nearestPointOnLine(lineStringFeature, turf.getCoord(routePoints))
	);
	return routePoints;
}

expose({ ratify });
