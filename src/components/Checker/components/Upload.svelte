<script lang="ts">
	import * as Comlink from 'comlink';
	import { onMount, onDestroy } from 'svelte';

	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';

	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';

	import { route } from '../../../stores/route.store';
	import { gpx } from '../../../stores/gpx.store';
	import { ratification as ratificationStore } from '../../../stores/ratification.store';
	import type { GPXGeoJson } from '../../../stores/gpx.store.d';

	import FilePond from 'svelte-filepond';
	import Details from './Details.svelte';

	import RatificationWorker from '$lib/workers/ratification.worker?worker';
	import type { ExposeRatificationWorker } from '$lib/workers/ratification.worker.d';

	let ratificationWorker: Worker;
	let pond;
	let name = 'filepond';
	let isVisible = false;

	function handleFilePondInit() {
		isVisible = true;
	}

	// TODO:  hand off to service worker
	async function handleAddFile(err: unknown, fileItem: { file: File }) {
		const data: GPXGeoJson = await load(fileItem.file, GPXLoader);
		gpx.set(data);
		const { ratify } = Comlink.wrap<ExposeRatificationWorker>(ratificationWorker);
		const ratificationResult = await ratify({ data, route: $route });
		terminateWorker();
		ratificationStore.set(ratificationResult);
	}

	function loadWorker() {
		ratificationWorker = new RatificationWorker();
	}

	function terminateWorker() {
		if (ratificationWorker) {
			ratificationWorker.terminate();
		}
	}

	onMount(() => {
		dayjs.extend(utc);
		loadWorker();
	});

	onDestroy(terminateWorker);
</script>

{#if $gpx.features.length === 0}
	<div
		class:opacity-1={isVisible}
		class:opacity-0={!isVisible}
		class="h-20 transition-opacity duration-500 delay-200"
	>
		<FilePond
			bind:this={pond}
			{name}
			allowMultiple={false}
			oninit={handleFilePondInit}
			onaddfile={handleAddFile}
			credits={false}
		/>
	</div>
{:else}
	<Details />
{/if}

<style global>
	@import 'filepond/dist/filepond.css';
</style>
