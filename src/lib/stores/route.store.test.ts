import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { route, routeFocus, isRouteReversed, routeBBox } from './route.store';
import { featureCollection } from '@turf/helpers';
import type { LngLatLike } from 'maplibre-gl';

describe('route store', () => {
    it('should initialize with an empty feature collection', () => {
        const $route = get(route);
        expect($route).toEqual(featureCollection([]));
    });

    it('should update route with new features', () => {
        const testFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                leg: 1,
                featureType: 'start',
                name: 'Test Point'
            }
        };

        route.set(featureCollection([testFeature]));
        const $route = get(route);
        expect($route.features).toHaveLength(1);
        expect($route.features[0]).toEqual(testFeature);
    });

    it('should initialize routeFocus as undefined', () => {
        const $routeFocus = get(routeFocus);
        expect($routeFocus).toBeUndefined();
    });

    it('should update routeFocus with new coordinates', () => {
        const testCoords: LngLatLike = [1, 2];
        routeFocus.set(testCoords);
        const $routeFocus = get(routeFocus);
        expect($routeFocus).toEqual(testCoords);
    });

    it('should initialize isRouteReversed as false', () => {
        const $isRouteReversed = get(isRouteReversed);
        expect($isRouteReversed).toBe(false);
    });

    it('should update isRouteReversed', () => {
        isRouteReversed.set(true);
        const $isRouteReversed = get(isRouteReversed);
        expect($isRouteReversed).toBe(true);
    });

    it('should calculate bbox for empty route', () => {
        const $routeBBox = get(routeBBox);
        expect($routeBBox).toEqual([0, 0, 0, 0]);
    });

    it('should calculate bbox for route with features', () => {
        const testFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [1, 2]
            },
            properties: {
                leg: 1,
                featureType: 'start',
                name: 'Test Point'
            }
        };

        route.set(featureCollection([testFeature]));
        const $routeBBox = get(routeBBox);
        expect($routeBBox).toEqual([1, 2, 1, 2]);
    });
}); 