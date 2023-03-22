import type { Map, LngLatBoundsLike } from 'maplibre-gl';
import type { BBox } from 'geojson';

const BOUNDS_PADDING_RATIO = { TOP: 0.15, BOTTOM: 0.15, LEFT: 0.35, RIGHT: 0.15 };

interface FitBoundsWithPaddingProps {
	map: Map;
	bBox: BBox;
}

export function fitBoundsWithPadding({ map, bBox }: FitBoundsWithPaddingProps) {
	if (bBox[0] === Infinity) return;
	const { width, height } = map.getCanvas();
	const padding = {
		top: height * BOUNDS_PADDING_RATIO.TOP,
		bottom: height * BOUNDS_PADDING_RATIO.BOTTOM,
		left: width * BOUNDS_PADDING_RATIO.LEFT,
		right: width * BOUNDS_PADDING_RATIO.RIGHT
	};
	map.fitBounds(bBox as LngLatBoundsLike, {
		padding
	});
}
