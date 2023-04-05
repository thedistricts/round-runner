import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';
import type { LngLatLike } from 'maplibre-gl';

import { writable, derived } from 'svelte/store';
import type { RouteGeoJson } from './route.store.d';

const EMPTY_COLLECTION: RouteGeoJson = featureCollection([]);
export const route = writable<RouteGeoJson>(EMPTY_COLLECTION);
export const routeFocus = writable<LngLatLike>(undefined);
export const routeBBox = derived(route, ($route) => bbox($route));
