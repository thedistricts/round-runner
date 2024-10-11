<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { gpx } from '$lib/stores/gpx.store';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { isOpen } from '$lib/stores/checker.store';
	import { URL_PARAM, DOM_EVENTS } from '$lib/enum';

	import RouteSelector from '../RouteSelector/RouteSelector.svelte';
	import { Upload, Checkpoints, Expander, Results, ExpandAction } from './components';

	let hasGpx = false;

	function handlePopState(e: PopStateEvent) {
		if (browser) {
			gpx.reset();
			$isOpen = (e.currentTarget as Window).location?.pathname.includes(
				URL_PARAM.ROUTE_INFORMATION
			);
		}
	}

	function handleOnClick() {
		$isOpen = !$isOpen;
		if (browser) {
			if ($isOpen) goto(`/${$page.params.round}/${URL_PARAM.ROUTE_INFORMATION}`);
			else goto(`/${$page.params.round}`);
		}
	}

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
		$isOpen = hasGpx;
	});

	onMount(() => {
		if (browser) window.addEventListener(DOM_EVENTS.POPSTATE, handlePopState);
		$isOpen = !!$page.params.showInfo;
	});

	onDestroy(() => {
		unsubscribeGpx();
		if (browser) window.removeEventListener(DOM_EVENTS.POPSTATE, handlePopState);
	});
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
