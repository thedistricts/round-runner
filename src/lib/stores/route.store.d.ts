import type { FeatureCollection, Point } from 'geojson';
import { PointFeature } from '../enum';
export interface PointProperties {
	leg: number;
	feature: PointFeature;
	name: string;
}

export type RouteGeoJson = FeatureCollection<Point, PointProperties>;
