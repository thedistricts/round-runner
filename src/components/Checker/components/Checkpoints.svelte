<script lang="ts">
	import { route } from '$lib/stores/route.store';
	$: isLoaded = $route.features.length > 0;
	export let isOpen = false;
</script>

{#if !isOpen}
	<div class="relative flex px-6 py-3 h-12">
		{#if isLoaded}
			<h3 class="text-base font-normal text-stone-800">{$route.features.length} Checkpoints</h3>
		{/if}
		<slot />
	</div>
{/if}

{#if isOpen}
	<div class="relative overflow-y-auto">
		<div class="px-6 py-3">
			{#if isLoaded}
				<h3 class="text-base font-normal text-stone-800">{$route.features.length} Checkpoints</h3>
			{/if}
			<slot />
			<ol class="text-sm text-stone-500 mt-4">
				{#each $route.features as { properties }, i}
					<li class="py-1">
						{i + 1}: {properties.name}
					</li>
				{/each}
			</ol>
		</div>
	</div>
{/if}
