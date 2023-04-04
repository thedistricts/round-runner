<script lang="ts">
	import { onDestroy } from 'svelte';
	import RouteSelector from '../RouteSelector/RouteSelector.svelte';
	import { Upload, Checkpoints, Expander, Results, ExpandAction } from './components';
	import { gpx } from '$lib/stores/gpx.store';

	let isOpen = false;
	let hasGpx = false;

	function handleOnClick() {
		isOpen = !isOpen;
	}

	const unsubscribe = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
		isOpen = hasGpx;
	});

	onDestroy(unsubscribe);

	// TODO: ratification processing should show a loading skeleton
</script>

<div class="h-screen">
	<div
		class:expanded={isOpen}
		class="pointer-events-auto bg-white rounded-md drop-shadow divide-y divide-slate-200 m-8 mr-0"
	>
		<RouteSelector />

		<div class="relative p-6">
			<Upload />
			<div class:hidden={hasGpx} class="absolute z-10 -bottom-10 right-6">
				<ExpandAction {handleOnClick} />
			</div>
		</div>

		<Expander {isOpen}>
			{#if hasGpx}
				<Results />
			{/if}
			{#if !hasGpx}
				<Checkpoints {isOpen} />
			{/if}
		</Expander>
	</div>
</div>

<style>
	.expanded {
		display: grid;
		grid-template-rows: 4rem auto 1fr;
		height: calc(100vh - 4rem);
	}
</style>
