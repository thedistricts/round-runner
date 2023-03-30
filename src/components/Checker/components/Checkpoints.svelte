<script lang="ts">
	import { route } from '../../../stores/route.store';
	$: isLoaded = $route.features.length > 0;
	export let isOpen = false;
</script>

{#if !isOpen}
	<div class="flex px-6 py-3 text-sm h-11">
		{#if isLoaded}
			{$route.features.length} Checkpoints
		{/if}
		<slot />
	</div>
{/if}

{#if isOpen}
	<div class="text-sm overflow-y-auto">
		<div class="px-6 py-3">
			<ol>
				{#each $route.features as { properties }, i}
					<li>
						{i + 1}: {properties.name}
					</li>
				{/each}
			</ol>
		</div>
	</div>
{/if}
