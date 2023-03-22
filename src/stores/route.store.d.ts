import type { FeatureCollection, Point } from 'geojson';

export interface PointProperties {
	leg: number;
	feature: string;
	name: string;
}

export type RouteGeoJson = FeatureCollection<Point, PointProperties>;
