import { ratify } from './ratification.worker';
import type { Point, Feature } from '@turf/turf';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { RouteGeoJson } from '$lib/stores/route.store.d';

type Ratify = typeof ratify;
export type ExposeRatificationWorker = {
	ratify: Ratify;
};

interface RatifyProps {
	track: GPXGeoJson;
	route: RouteGeoJson;
}

type NearestPointOnLineWithValidity = Feature<
	Point,
	{ index: number; dist: number; location: number; valid: VALIDITY }
>;
type RatifyReturn = NearestPointOnLineWithValidity[];
