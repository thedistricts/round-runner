<script lang="ts">
	import { routeStore } from '../../../stores/route.store';
	$: isLoaded = $routeStore.features.length > 0;
</script>

<div class="px-6 py-3 text-sm h-11">
	{#if isLoaded}
		{$routeStore.features.length} Checkpoints
	{/if}
</div>
