<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { route } from '../stores/route.store';
	import type { RouteGeoJson } from '../stores/route.store.d';

	onMount(async () => {
		const res = await fetch('data/frog-graham.geo.json');
		const data: RouteGeoJson = await res.json();
		route.set(data);
	});
</script>

<slot />
