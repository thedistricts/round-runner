<script lang="ts">
	import { onDestroy, beforeUpdate, onMount } from 'svelte';
	import { isOpen } from '$lib/stores/checker.store';
	import { gpx } from '$lib/stores/gpx.store';
	import { route } from '$lib/stores/route.store';
	import { Checkpoints } from '../../components/Checker/components';
	import { page } from '$app/stores';

	$: hasGpx = false;

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
	});

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			if ($page.data.geojson) {
				route.set($page.data.geojson);
			}
		});
		return unsubscribe;
	});

	onDestroy(() => {
		unsubscribeGpx();
	});

	beforeUpdate(() => {
		isOpen.set(false);
	});
</script>

<Checkpoints />
