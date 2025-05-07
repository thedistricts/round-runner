<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { isOpen } from '$lib/stores/checker.store';
	import { gpx } from '$lib/stores/gpx.store';
	import { Results } from '../../../components/Checker/components';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let hasGpx = false;

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
	});

	onDestroy(() => {
		unsubscribeGpx();
	});

	beforeUpdate(() => {
		isOpen.set(true);
	});

	onMount(() => {
		if (!hasGpx) {
			goto(`/${$page.params.round}`, { replaceState: true });
		}
	});
</script>

{#if hasGpx}
	<Results />
{/if}
