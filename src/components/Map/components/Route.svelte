<script lang="ts">
	import { routeStore } from '../../../stores/route.store';
	import Marker from './Marker.svelte';
</script>

{#each $routeStore.features as point}
	<Marker coordinates={point.geometry.coordinates} />
{/each}
