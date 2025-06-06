<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { gpx } from '$lib/stores/gpx.store';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { isOpen } from '$lib/stores/checker.store';
	import { URL_PARAM, DOM_EVENTS } from '$lib/enum';

	import RouteSelector from '../RouteSelector/RouteSelector.svelte';
	import { Upload, Expander, ExpandAction } from './components';

	$: hasGpx = false;

	function handlePopState(e: PopStateEvent) {
		gpx.reset();
		if (browser) {
			$isOpen = (e.currentTarget as Window).location?.pathname.includes(
				URL_PARAM.ROUTE_INFORMATION
			);
		}
	}

	function handleOnClick() {
		if (!$isOpen) goto(`/${$page.params.round}/${URL_PARAM.ROUTE_INFORMATION}`);
		else goto(`/${$page.params.round}`);
		$isOpen = !$isOpen;
	}

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
		$isOpen = hasGpx;
	});

	const unsubscribeOpen = isOpen.subscribe((isOpenBoolen) => {
		$isOpen = isOpenBoolen;
	});

	beforeNavigate(() => {
		gpx.reset();
	});

	onMount(() => {
		if (browser) window.addEventListener(DOM_EVENTS.POPSTATE, handlePopState);
	});

	onDestroy(() => {
		unsubscribeGpx();
		unsubscribeOpen();
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
				<slot />
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
