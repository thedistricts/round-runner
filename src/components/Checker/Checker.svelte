<script lang="ts">
	import { onDestroy } from 'svelte';
	import RouteSelector from '../RouteSelector/RouteSelector.svelte';
	import { Upload, Checkpoints, Expander, Results, ExpandAction } from './components';
	import { gpx } from '$lib/stores/gpx.store';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { isOpen } from '$lib/stores/checker.store';

	let hasGpx = false;

	function handleOnClick() {
		$isOpen = !$isOpen;
	}

	const unsubscribe = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
		$isOpen = hasGpx;
	});

	onDestroy(unsubscribe);
</script>

<div class="md:h-screen print:h-auto">
	<div
		class:expanded={$isOpen}
		class="
			pointer-events-auto
			bg-white rounded-md drop-shadow
			divide-y divide-slate-200
			m-8 mr-0
			print:drop-shadow-none
			print:m-0
		"
	>
		<RouteSelector />

		<div class="relative p-6 print:hidden">
			<Upload />
			<div class:hidden={hasGpx} class="absolute -bottom-10 right-6">
				<ExpandAction {handleOnClick} />
			</div>
		</div>

		<Expander isOpen={$isOpen}>
			<div class:print:hidden={$breakdown} class="mx-auto grow">
				{#if hasGpx}
					<Results />
				{/if}
				{#if !hasGpx}
					<Checkpoints />
				{/if}
			</div>
		</Expander>
	</div>
</div>

<style>
	.expanded {
		@media (min-width: 768px) {
			display: grid;
			grid-template-rows: 4rem auto 1fr;
			height: calc(100vh - 4rem);
		}

		@media print {
			display: block;
			height: auto;
		}
	}
</style>
