import { writable } from 'svelte/store';
import { featureCollection } from '@turf/turf';
import type { FeatureCollection } from 'geojson';

export const gpx = writable<FeatureCollection>(featureCollection([])); 