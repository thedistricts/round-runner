<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { debug } from '$lib/stores/ratification.store';
	import DebugSegment from './DebugSegment.svelte';

	$: isLoaded = $debug?.features?.length > 0;
	$: isDebug = false;

	onMount(() => {
		if (browser) {
			const urlParams = new URLSearchParams(window.location.search);
			isDebug = urlParams.has('debug');
		}
	});
</script>

{#if isLoaded && isDebug}
	{#each $debug.features as debugLine, index}
		<DebugSegment features={debugLine} {index} />
	{/each}
{/if}
