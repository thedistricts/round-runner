import { ratify } from './ratification.worker';
import type { Point, Feature } from '@turf/turf';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { RouteGeoJson, PointProperties } from '$lib/stores/route.store.d';

type Ratify = typeof ratify;
export type ExposeRatificationWorker = {
	ratify: Ratify;
};

interface RatifyProps {
	track: GPXGeoJson;
	route: RouteGeoJson;
};


interface NearestPointOnLineProperties extends PointProperties  { index: number; dist: number; location: number; };
interface ValidityPointProperties extends NearestPointOnLineProperties { valid: VALIDITY, time?: string, order: number, notes?: string };

export type NearestPointOnLineWithValidity = Feature<
	Point,
	ValidityPointProperties
> ;
type RatifyReturn = NearestPointOnLineWithValidity[];
