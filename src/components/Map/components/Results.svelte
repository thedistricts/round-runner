<script lang="ts">
	// import { getContext, onMount } from 'svelte';
	import * as turf from '@turf/turf';
	// import type { Units } from '@turf/turf';
	import { ratification } from '../../../stores/ratification.store';

	// import { key } from '../Map.context';
	// import type { MapContext } from '../Map.context';
	// const { getMap } = getContext<MapContext>(key);

	import Circle from './Circle.svelte';
</script>

{#each $ratification as point}
	<Circle coordinates={turf.getCoord(point)} />
{/each}
