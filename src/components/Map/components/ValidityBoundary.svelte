<script lang="ts">
	import { VALIDITY } from '$lib/enum';
	import { VALIDITY_DISTANCE, FEATURE_COLOUR } from '$lib/const';
	import Circle from './Circle.svelte';

	import type { Position } from 'geojson';
	import type { PointProperties } from '$lib/stores/route.store.d';

	export let coordinates: Position;
	export let properties: PointProperties;

	const color = FEATURE_COLOUR.get(properties.featureType);
	const radius = VALIDITY_DISTANCE.get(properties.featureType);
</script>

<Circle {coordinates} colour={color} radius={radius?.[VALIDITY.VALID]} opacity={0.15} />
<Circle {coordinates} colour={color} radius={radius?.[VALIDITY.WARN]} opacity={0.1} />
