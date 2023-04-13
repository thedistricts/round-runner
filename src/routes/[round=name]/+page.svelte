<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { route } from '$lib/stores/route.store';
	import type { RouteGeoJson } from '$lib/stores/route.store.d';
	import Checker from '../../components/Checker/Checker.svelte';

	export let data: PageData;

	onMount(async () => {
		const res = await fetch(data.json);
		const routeGeoJson: RouteGeoJson = await res.json();
		route.set(routeGeoJson);
	});
</script>

<div class="grid grid-cols-3 gap-4 relative h-screen z-10 pointer-events-none">
	<Checker />
	<slot />
</div>
