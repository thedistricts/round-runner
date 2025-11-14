<script lang="ts">
	import { isOpen } from '$lib/stores/checker.store';
	import { onMount } from 'svelte';
	import { Checkpoints } from '../../../components/Checker/components';
	import { route } from '$lib/stores/route.store';
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import type { RouteGeoJson } from '$lib/stores/route.store.d';
	export let data: PageData & { geojson: RouteGeoJson };
	import { browser } from '$app/environment';

	isOpen.set(true);

	// Initialize route store during SSR (not just in onMount)
	if (!browser && data.geojson) {
		route.set(data.geojson);
	}

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			if ($page.data.geojson) {
				route.set($page.data.geojson);
			}
		});
		return unsubscribe;
	});
</script>

<Checkpoints />
