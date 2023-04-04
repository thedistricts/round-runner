<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ratification, results } from '$lib/stores/ratification.store';
	import { Loader } from './';

	// import { VALIDITY } from '$lib/enum';

	let hasRatificationResults = false;

	const unsubscribe = ratification.subscribe((results) => {
		hasRatificationResults = results.length > 0;
	});
	onDestroy(unsubscribe);
</script>

{#if hasRatificationResults}
	<div>valid: {$results.valids?.length}</div>
	<div>invalids: {$results.invalids?.length}</div>
	<div>warnings: {$results.warnings?.length}</div>
{/if}
{#if !hasRatificationResults}
	<div class="text-center py-3">
		<Loader />
	</div>
{/if}
