import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { ratification, results, submissionPoints, resultsFocus, debug } from './ratification.store';
import { VALIDITY } from '$lib/enum';
import type { RatificationResults } from './ratification.store.d';
import type { LngLatLike } from 'maplibre-gl';
import { featureCollection } from '@turf/helpers';

describe('ratification store', () => {
  beforeEach(() => {
    ratification.reset();
    resultsFocus.set(undefined);
    debug.reset();
  });

  describe('ratification store', () => {
    it('should initialize with empty array', () => {
      expect(get(ratification)).toEqual([]);
    });

    it('should update ratification results', () => {
      const testResults: RatificationResults = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {
            valid: VALIDITY.VALID,
            ratify: true
          }
        }
      ];

      ratification.set(testResults);
      expect(get(ratification)).toEqual(testResults);
    });

    it('should reset ratification results', () => {
      const testResults: RatificationResults = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {
            valid: VALIDITY.VALID,
            ratify: true
          }
        }
      ];

      ratification.set(testResults);
      ratification.reset();
      expect(get(ratification)).toEqual([]);
    });
  });

  describe('results derived store', () => {
    it('should filter results by validity', () => {
      const testResults: RatificationResults = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {
            valid: VALIDITY.VALID,
            ratify: true
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [1, 1]
          },
          properties: {
            valid: VALIDITY.FAIL,
            ratify: true
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [2, 2]
          },
          properties: {
            valid: VALIDITY.WARN,
            ratify: true
          }
        }
      ];

      ratification.set(testResults);
      const filteredResults = get(results);

      expect(filteredResults.valids).toHaveLength(1);
      expect(filteredResults.invalids).toHaveLength(1);
      expect(filteredResults.warnings).toHaveLength(1);
    });
  });

  describe('submissionPoints derived store', () => {
    it('should filter points by ratify property', () => {
      const testResults: RatificationResults = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {
            valid: VALIDITY.VALID,
            ratify: true
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [1, 1]
          },
          properties: {
            valid: VALIDITY.VALID,
            ratify: false
          }
        }
      ];

      ratification.set(testResults);
      const submissionResults = get(submissionPoints);

      expect(submissionResults).toHaveLength(1);
      expect(submissionResults[0].properties.ratify).toBe(true);
    });
  });

  describe('resultsFocus store', () => {
    it('should initialize as undefined', () => {
      expect(get(resultsFocus)).toBeUndefined();
    });

    it('should update focus coordinates', () => {
      const testCoordinates: LngLatLike = [0, 0];
      resultsFocus.set(testCoordinates);
      expect(get(resultsFocus)).toEqual(testCoordinates);
    });
  });

  describe('debug store', () => {
    it('should initialize with empty feature collection', () => {
      expect(get(debug)).toEqual({
        type: 'FeatureCollection',
        features: []
      });
    });

    it('should reset to empty feature collection', () => {
      const testCollection = featureCollection([{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {}
      }]);
      debug.set(testCollection);
      debug.reset();
      expect(get(debug)).toEqual({
        type: 'FeatureCollection',
        features: []
      });
    });
  });
}); 