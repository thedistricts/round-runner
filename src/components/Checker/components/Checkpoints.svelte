<script lang="ts">
	import { route } from '../../../stores/route.store';
	$: isLoaded = $route.features.length > 0;
</script>

<div class="px-6 py-3 text-sm h-11">
	{#if isLoaded}
		{$route.features.length} Checkpoints
	{/if}
</div>
