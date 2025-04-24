import { ratify, debug } from './ratification.worker';
import type { Point, Feature, Properties } from '@turf/helpers';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { LineStringProperties } from '$lib/stores/gpx.store.d';
import { VALIDITY } from '$lib/enum';

import type { RouteGeoJson, PointProperties } from '$lib/stores/route.store.d';

type Ratify = typeof ratify;
type Debug = typeof debug;

export type ExposeRatificationWorker = {
	ratify: Ratify;
	debug: Debug;
};

export interface RatifyProps {
	track: GPXGeoJson;
	route: RouteGeoJson;
}

interface NearestPointOnLineProperties extends PointProperties {
	index: number;
	dist: number | undefined;
	location: number;
}

export interface ValidityPointProperties extends Properties {
	dist: number;
	index: number;
	isStart: boolean;
	isEnd: boolean;
	valid: VALIDITY;
	order: number;
	notes: string[];
	ratify: boolean;
	leg: number;
	featureType: string;
	name: string;
	validityDistance: number;
	time: string;
}

export type PointFeature = Feature<Point, ValidityPointProperties>;

export interface ValidityDistance {
	[key: number]: number;
}

export type NearestPointOnLineWithValidity = Feature<Point, ValidityPointProperties>;
type RatifyReturn = NearestPointOnLineWithValidity[];

export interface SortByGridProps {
	trackLineString: turf.Feature<turf.LineString, LineStringProperties>;
	routePoints: RouteGeoJson;
	boundingBox?: turf.BBox;
}

export interface GetNearestPointOnLineWithValidityProps {
	trackLineString: turf.Feature<turf.LineString>;
	point: turf.Feature<turf.Point>;
	order?: number;
	times: string[];
	index: number;
}

export interface GetSlicesFromProps {
	from: FeatureCollection<Feature<Point, PointProperties>[]>;
	with: FeatureCollection<Point, PointProperties>;
}
export type GetSlicesFromReturn = turf.helpers.Feature<
	turf.helpers.LineString,
	turf.helpers.Properties
>[];

export type CoordWithDistance = {
	geometry: {
			coordinates: turf.helpers.Position;
			type: "Point";
			bbox?: turf.helpers.BBox | undefined;
	};
	properties: {
			order?: number;
			time?: string;
			dist: number;
			index: number;
			isStart: boolean;
			isEnd: boolean;
			valid: VALIDITY;
	};
	type: "Feature";
	id?: turf.helpers.Id | undefined;
	bbox?: turf.helpers.BBox | undefined;
}

export type Distances = CoordWithDistance[] 