import { writable } from 'svelte/store';
import type { RouteGeoJson } from "./route.store.d"

export const routeStore = writable<RouteGeoJson>({
  type: 'FeatureCollection',
  features: []
});