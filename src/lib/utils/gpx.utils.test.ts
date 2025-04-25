import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { convertToGPX } from './gpx.utils';
import { featureCollection, point } from '@turf/helpers';
import type { RouteGeoJson } from '$lib/stores/route.store.d';

describe('gpx utils', () => {
    describe('convertToGPX', () => {
        let mockDate: Date;

        beforeEach(() => {
            // Mock the date to ensure consistent test output
            mockDate = new Date('2024-01-01T00:00:00Z');
            vi.useFakeTimers();
            vi.setSystemTime(mockDate);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should generate valid GPX with single waypoint', () => {
            const route: RouteGeoJson = featureCollection([
                point([-1.234, 51.234], { 
                    leg: 1,
                    featureType: 'checkpoint',
                    name: 'Test Point'
                })
            ]) as RouteGeoJson;

            const expected = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Round Runner"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Test Round</name>
    <time>2024-01-01T00:00:00.000Z</time>
  </metadata>
  <wpt lat="51.234" lon="-1.234">
    <name>Test Point</name>
  </wpt>
</gpx>`;

            expect(convertToGPX(route, 'Test Round')).toBe(expected);
        });

        it('should include round info when provided', () => {
            const route: RouteGeoJson = featureCollection([
                point([-1.234, 51.234], { 
                    leg: 1,
                    featureType: 'checkpoint',
                    name: 'Test Point'
                })
            ]) as RouteGeoJson;

            const result = convertToGPX(route, 'Test Round', 'Round Description');
            expect(result).toContain('<desc>Round Description</desc>');
        });

        it('should handle waypoint with notes', () => {
            const route: RouteGeoJson = featureCollection([
                point([-1.234, 51.234], { 
                    leg: 1,
                    featureType: 'checkpoint',
                    name: 'Test Point',
                    notes: 'Test Notes'
                })
            ]) as RouteGeoJson;

            const result = convertToGPX(route, 'Test Round');
            expect(result).toContain('<desc>Test Notes</desc>');
        });

        it('should handle multiple waypoints', () => {
            const route: RouteGeoJson = featureCollection([
                point([-1.234, 51.234], { 
                    leg: 1,
                    featureType: 'checkpoint',
                    name: 'Point 1'
                }),
                point([-1.235, 51.235], { 
                    leg: 2,
                    featureType: 'checkpoint',
                    name: 'Point 2'
                })
            ]) as RouteGeoJson;

            const result = convertToGPX(route, 'Test Round');
            expect(result).toContain('<name>Point 1</name>');
            expect(result).toContain('<name>Point 2</name>');
            expect(result).toContain('lat="51.234"');
            expect(result).toContain('lat="51.235"');
        });

        it('should handle empty route', () => {
            const route: RouteGeoJson = featureCollection([]) as RouteGeoJson;
            const result = convertToGPX(route, 'Test Round');
            
            expect(result).toContain('<name>Test Round</name>');
            expect(result).not.toContain('<wpt');
        });
    });
}); 