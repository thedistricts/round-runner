import * as maplibre from 'maplibre-gl';
import type { Map, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import type { BBox } from 'geojson';

const BOUNDS_PADDING_RATIO = { TOP: 0.95, RIGHT: 0.02, BOTTOM: 0.95, LEFT: 0.3 };
const BOUNDS_PADDING_RATIO_MOBILE = { TOP: 0.3, RIGHT: 0.15, BOTTOM: 0, LEFT: 0.15 };

interface FitUtilProps {
	map?: Map;
	animate?: boolean;
	delay?: number;
	isMobile?: boolean;
}
interface FitBoundsWithPaddingProps extends FitUtilProps {
	bBox: BBox;
}
interface FitPositionWithOffsetProps extends FitUtilProps {
	position?: LngLatLike;
	maxZoom?: number;
	duration?: number;
}

export function fitBoundsWithPadding({
	map,
	bBox,
	animate = true,
	delay = 125, 
	isMobile
}: FitBoundsWithPaddingProps) {
	if (!Number.isFinite(bBox[0]) || !map) return;
	const width = window.innerWidth;
	const height = window.innerHeight;

	const padding = {
		top: isMobile ? (height * BOUNDS_PADDING_RATIO_MOBILE.TOP) :  height * BOUNDS_PADDING_RATIO.TOP,
		bottom: isMobile ? (height * BOUNDS_PADDING_RATIO_MOBILE.BOTTOM) : (height * BOUNDS_PADDING_RATIO.BOTTOM),
		left: isMobile ? (width * BOUNDS_PADDING_RATIO_MOBILE.LEFT) : (width * BOUNDS_PADDING_RATIO.LEFT),
		right: isMobile ? (width * BOUNDS_PADDING_RATIO_MOBILE.RIGHT) : (width * BOUNDS_PADDING_RATIO.RIGHT),
	};

	setTimeout(() => {
		map.fitBounds(bBox as LngLatBoundsLike, {
			padding,
			animate
		});
	}, delay);
}

export function fitPositionWithOffset({
	map,
	position,
	animate = true,
	maxZoom = 13,
	duration = 1000,
	delay = 125,
	isMobile
}: FitPositionWithOffsetProps) {
	if (!position || !map) return;
	const width = window.innerWidth;
	const height = window.innerHeight;
	const padding = {
		top: isMobile ? (height * 0.3) :  0,
		left: isMobile ? 0 : (width * BOUNDS_PADDING_RATIO.LEFT),
	};
	const bounds = new maplibre.LngLatBounds().extend(position as LngLatLike);
	setTimeout(() => {
		map.fitBounds(bounds, { maxZoom, padding, duration, animate });
	}, delay);
}
