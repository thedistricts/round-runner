import type { Feature, Point } from '@turf/helpers';
import type { VALIDITY } from '$lib/enum';

type RatificationPointResult = {
	dist?: number;
	location?: number;
	index?: number;
	valid?: VALIDITY;
};

export type RatificationResults = Feature<Point, RatificationPointResult>[];
