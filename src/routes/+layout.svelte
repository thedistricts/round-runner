<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { route } from '$lib/stores/route.store';
	import type { RouteGeoJson } from '$lib/stores/route.store.d';

	onMount(async () => {
		const res = await fetch('data/frog-graham-cw.geo.json');
		const data: RouteGeoJson = await res.json();
		route.set(data);
	});
</script>

<slot />
