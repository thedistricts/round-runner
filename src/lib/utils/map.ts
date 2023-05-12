import * as maplibre from 'maplibre-gl';
import type { Map, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import type { BBox } from 'geojson';

const BOUNDS_PADDING_RATIO = { TOP: 0.05, RIGHT: 0.02, BOTTOM: 0.05, LEFT: 0.18 };

interface FitUtilProps {
	map?: Map;
	animate?: boolean;
	delay?: number;
}
interface FitBoundsWithPaddingProps extends FitUtilProps {
	bBox: BBox;
}
interface FitPositionWithOffsetProps extends FitUtilProps {
	position?: LngLatLike;
	maxZoom?: number;
	duration?: number;
	offset?: number;
}

export function fitBoundsWithPadding({
	map,
	bBox,
	animate = true,
	delay = 125
}: FitBoundsWithPaddingProps) {
	if (!Number.isFinite(bBox[0]) || !map) return;
	const { width, height } = map.getCanvas();
	const padding = {
		top: height * BOUNDS_PADDING_RATIO.TOP,
		bottom: height * BOUNDS_PADDING_RATIO.BOTTOM,
		left: width * BOUNDS_PADDING_RATIO.LEFT,
		right: width * BOUNDS_PADDING_RATIO.RIGHT
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
	offset = 0.3333,
	delay = 125
}: FitPositionWithOffsetProps) {
	if (!position || !map) return;
	const { width } = map.getCanvas();
	const padding = {
		left: width * offset
	};
	const bounds = new maplibre.LngLatBounds().extend(position as LngLatLike);
	setTimeout(() => {
		map.fitBounds(bounds, { maxZoom, padding, duration, animate });
	}, delay);
}
