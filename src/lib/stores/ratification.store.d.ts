import type { Feature, Point } from '@turf/helpers';

type RatificationPointResult = {
	dist?: number;
	location?: number;
	index?: number;
};

export type RatificationResults = Feature<Point, RatificationPointResult>[];
