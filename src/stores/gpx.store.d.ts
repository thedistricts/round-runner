import type { FeatureCollection, LineString } from 'geojson';

export interface CoordinateProperties {
	times: string[];
}
export interface LineStringProperties {
	coordinateProperties: CoordinateProperties;
	gpxx_TrackExtension: string;
	name: string;
	time: string;
	_gpxType: string;
}

export type GPXGeoJson = FeatureCollection<LineString, LineStringProperties>;
