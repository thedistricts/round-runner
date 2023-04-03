<script lang="ts">
	import * as turf from '@turf/turf';
	import { ratification } from '$lib/stores/ratification.store';
	import Circle from './Circle.svelte';
</script>

{#each $ratification as point}
	<Circle
		coordinates={turf.getCoord(point)}
	/>
{/each}
