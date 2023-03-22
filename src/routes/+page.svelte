<script lang="ts">
	import { onMount } from 'svelte';
	import { routeStore } from '../stores/route.store';
	import type { RouteGeoJson } from '../stores/route.store.d';

	import Map from '../components/Map/Map.svelte';
	import Checker from '../components/Checker/Checker.svelte';
	// import Breakdown from '../components/Breakdown/Breakdown.svelte';

	onMount(async () => {
		const res = await fetch('data/frog-graham.geo.json');
		const data: RouteGeoJson = await res.json();
		routeStore.set(data);
	});

</script>

<main>
	<Map />
	<div class="grid grid-cols-3 gap-4 relative z-10 pointer-events-none">
		<Checker />
		<!-- <div class="col-span-2 h-screen">
      <Breakdown />
    </div> -->
	</div>
</main>
