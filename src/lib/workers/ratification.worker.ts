import { expose } from 'comlink';
import * as turf from '@turf/turf';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { RouteGeoJson } from '$lib/stores/route.store.d';
import { VALIDITY } from "$lib/enum";
import { VALIDITY_DISTANCE } from "$lib/const";

interface RatifyProps {
	track: GPXGeoJson;
	route: RouteGeoJson;
}

export function ratify({ track, route }: RatifyProps) {
	const trackLineString = track.features.find((feature) => feature.geometry.type === 'LineString');

	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const nearestRoutePoints = route.features.map((routePoint) => {
		const point = turf.nearestPointOnLine(trackLineString, turf.getCoord(routePoint));
		point.properties = {
			...point.properties,
			valid: VALIDITY.FAIL
		};

		const distanceAway = point.properties?.dist ?? Infinity;
		const validityDistance = VALIDITY_DISTANCE.get(routePoint.properties.feature);

		if (!validityDistance) {
			throw new Error('Route feature type is not valid');
		}

		if (distanceAway < validityDistance?.[VALIDITY.WARN]) {
			point.properties.valid = VALIDITY.WARN;
		}
		if (distanceAway < validityDistance?.[VALIDITY.VALID]) {
			point.properties.valid = VALIDITY.VALID;
		}
		return point;
	});

	return nearestRoutePoints;
}

expose({ ratify });
