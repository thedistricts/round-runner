import { ratify, debug } from './ratification.worker';
import type { Point, Feature } from '@turf/turf';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { LineStringProperties } from '$lib/stores/gpx.store.d';

import type { RouteGeoJson, PointProperties } from '$lib/stores/route.store.d';

type Ratify = typeof ratify;
type Debug = typeof debug;

export type ExposeRatificationWorker = {
	ratify: Ratify;
	debug: Debug;
};

interface RatifyProps {
	track: GPXGeoJson;
	route: RouteGeoJson;
};

interface NearestPointOnLineProperties extends PointProperties  { index: number; dist: number; location: number; };
interface ValidityPointProperties extends NearestPointOnLineProperties { valid: VALIDITY, time?: string, order: number, notes?: string, ratify?: boolean };

export type NearestPointOnLineWithValidity = Feature<
	Point,
	ValidityPointProperties
> ;
type RatifyReturn = NearestPointOnLineWithValidity[];

export interface SortByGridProps {
	trackLineString: turf.Feature<turf.LineString, LineStringProperties>;
	routePoints: RouteGeoJson;
	boundingBox?: turf.BBox;
}

export interface GetNearestPointOnLineWithValidityProps {
	trackLineString: turf.Feature<turf.LineString>;
	point: turf.Feature<turf.Point>;
	order: number;
	times: string[];
	index: number;
}

export interface GetSlicesFromProps {
	from: FeatureCollection<Feature<Point, PointProperties>[]>;
	with: FeatureCollection<Point, PointProperties>;
}
export type GetSlicesFromReturn = turf.helpers.Feature<turf.helpers.LineString, turf.helpers.Properties>[];