import type { FeatureCollection, Point } from 'geojson';
import { PointFeature } from '../enum';
export interface PointProperties {
	leg: number;
	featureType: PointFeature;
	name: string;
	notes?: string;
	ratify?: boolean;
	validityDistance?: [number, number]
}

export type RouteGeoJson = FeatureCollection<Point, PointProperties>;
