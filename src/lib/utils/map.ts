import type { Map, LngLatBoundsLike } from 'maplibre-gl';
import type { BBox } from 'geojson';

const BOUNDS_PADDING_RATIO = { TOP: 0.05, RIGHT: 0.02, BOTTOM: 0.05, LEFT: 0.18 };

interface FitBoundsWithPaddingProps {
	map: Map;
	bBox: BBox;
	animate?: boolean;
}

export function fitBoundsWithPadding({ map, bBox, animate = true }: FitBoundsWithPaddingProps) {
	if (!Number.isFinite(bBox[0])) return;
	const { width, height } = map.getCanvas();
	const padding = {
		top: height * BOUNDS_PADDING_RATIO.TOP,
		bottom: height * BOUNDS_PADDING_RATIO.BOTTOM,
		left: width * BOUNDS_PADDING_RATIO.LEFT,
		right: width * BOUNDS_PADDING_RATIO.RIGHT
	};
	map.fitBounds(bBox as LngLatBoundsLike, {
		padding,
		animate
	});
}
