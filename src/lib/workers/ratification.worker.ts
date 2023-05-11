import { expose } from 'comlink';
import * as turf from '@turf/turf';
import { featureCollection } from '@turf/helpers';
import { VALIDITY, POINT_FEATURE } from '$lib/enum';
import { VALIDITY_DISTANCE } from '$lib/const';

// TODO: display length along track turf.length
import type {
	RatifyProps,
	RatifyReturn,
	NearestPointOnLineWithValidity,
	GetNearestPointOnLineWithValidityProps,
	GetSlicesFromProps,
	GetSlicesFromReturn
} from './ratification.worker.d';

function getNearestPointOnLineWithValidity({
	trackLineString,
	point: routePoint,
	order,
	times,
	index
}: GetNearestPointOnLineWithValidityProps): NearestPointOnLineWithValidity {
	const point = turf.nearestPointOnLine(trackLineString, routePoint);
	point.properties.index = index;

	const distanceAway = point.properties?.dist ?? Infinity;
	const validityDistance = VALIDITY_DISTANCE.get(routePoint.properties?.featureType);
	const time = times?.[index];

	point.properties = {
		...routePoint.properties,
		...point.properties,
		order: order + 1,
		valid: VALIDITY.FAIL,
		time
	};

	if (!validityDistance) throw new Error('Route feature type is not valid');

	if (distanceAway < validityDistance?.[VALIDITY.WARN]) {
		point.properties.valid = VALIDITY.WARN;
	}
	if (distanceAway < validityDistance?.[VALIDITY.VALID]) {
		point.properties.valid = VALIDITY.VALID;
	}
	return point as NearestPointOnLineWithValidity;
}

function getSlices({
	from: route,
	with: trackLineString
}: GetSlicesFromProps): GetSlicesFromReturn {
	const slices = route.features.map((_, index: number) => {
		// NOTE: to ensure we don't mismatch the start with the end
		// i.e. when the end point of a round is closer to the start than the first track point
		// we slice the track in parts and enforce the beginning and finish of the route
		const isInRange = index < route.features.length - 1;
		const isStart = route.features[index].properties.featureType === POINT_FEATURE.CHECKPOINT_START;
		const isEnd =
			!isInRange ||
			route.features[index + 1].properties.featureType === POINT_FEATURE.CHECKPOINT_FINISH;

		const start = isStart
			? turf.point(trackLineString.geometry.coordinates[0])
			: route.features[index];

		const end = isEnd
			? turf.point(
					trackLineString.geometry.coordinates[trackLineString.geometry.coordinates.length - 1]
			  )
			: route.features[index + 1];

		const slice = turf.lineSlice(start, end, trackLineString);
		return slice;
	});
	return slices;
}

export function ratify({ track, route }: RatifyProps): RatifyReturn {
	const trackLineString = track.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}
	const slicedChunks = getSlices({ from: route, with: trackLineString });

	let totalIndex = 0;

	const nearestRoutePointsTotal = slicedChunks.map((currentChunk, currentChunkIndex) => {
		const nearest = getNearestPointOnLineWithValidity({
			trackLineString: currentChunk,
			times: trackLineString.properties?.coordinateProperties?.times,
			index: totalIndex,
			point: route.features[currentChunkIndex],
			order: currentChunkIndex
		});
		totalIndex += currentChunk.geometry.coordinates.length - 2;
		return nearest;
	});
	return nearestRoutePointsTotal;
}

export function debug({ track, route }: RatifyProps) {
	const trackLineString = track.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const slicedChunks = getSlices({ from: route, with: trackLineString });
	slicedChunks.pop();
	return featureCollection(slicedChunks);
}

expose({ ratify, debug });
