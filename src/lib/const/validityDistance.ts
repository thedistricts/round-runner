import { VALIDITY, POINT_FEATURE } from '$lib/enum';

export const VALIDITY_DISTANCE = new Map([
	[POINT_FEATURE.CHECKPOINT, { [VALIDITY.VALID]: 0.015, [VALIDITY.WARN]: 0.08 }],
	[POINT_FEATURE.CHECKPOINT_START, { [VALIDITY.VALID]: 0.015, [VALIDITY.WARN]: 0.08 }],
	[POINT_FEATURE.CHECKPOINT_FINISH, { [VALIDITY.VALID]: 0.015, [VALIDITY.WARN]: 0.08 }],
	[POINT_FEATURE.SUMMIT, { [VALIDITY.VALID]: 0.008, [VALIDITY.WARN]: 0.05 }],
	[POINT_FEATURE.WATER_ENTRY, { [VALIDITY.VALID]: 0.15, [VALIDITY.WARN]: 0.3 }],
	[POINT_FEATURE.WATER_EXIT, { [VALIDITY.VALID]: 0.15, [VALIDITY.WARN]: 0.3 }],
	[POINT_FEATURE.WATER_CHECKPOINT, { [VALIDITY.VALID]: 0.055, [VALIDITY.WARN]: 0.1 }]
]);
