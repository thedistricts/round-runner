import { POINT_FEATURE } from '$lib/enum';

export const FEATURE_COLOUR = new Map([
  [POINT_FEATURE.CHECKPOINT, '#000000'],
  [POINT_FEATURE.SUMMIT, '#FF0000'],
  [POINT_FEATURE.WATER_ENTRY, '#6FDBFF'],
  [POINT_FEATURE.WATER_EXIT, '#6FDBFF']
]);
