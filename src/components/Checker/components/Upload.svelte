<script lang="ts">
	import * as Comlink from 'comlink';
	import { onMount, onDestroy } from 'svelte';

	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';

	// TODO: also allow .KML files?
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';

	import { route } from '$lib/stores/route.store';
	import { gpx } from '$lib/stores/gpx.store';
	import { ratification as ratificationStore } from '$lib/stores/ratification.store';
	import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

	import FilePond from 'svelte-filepond';
	import Details from './Details.svelte';

	import RatificationWorker from '$lib/workers/ratification.worker?worker';
	import type { ExposeRatificationWorker } from '$lib/workers/ratification.worker.d';

	let ratificationWorker: Worker;
	let pond;
	let name = 'filepond';
	let isVisible = false;
	let fileName = '';

	function handleFilePondInit() {
		isVisible = true;
	}

	async function handleAddFile(_err: unknown, fileItem: { file: File }) {
		loadWorker();
		const data: GPXGeoJson = await load(fileItem.file, GPXLoader);
		gpx.set(data);
		fileName = fileItem.file.name;
		const { ratify } = Comlink.wrap<ExposeRatificationWorker>(ratificationWorker);
		const ratificationResult = await ratify({ track: data, route: $route });
		ratificationStore.set(ratificationResult);
		terminateWorker();
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
	});

	onDestroy(terminateWorker);
</script>

{#if $gpx.features.length === 0}
	<div
		class:opacity-1={isVisible}
		class:opacity-0={!isVisible}
		class="h-20 transition-opacity duration-500 delay-200"
	>
		<!-- TODO: look at FileTypeValidation -->
		<FilePond
			bind:this={pond}
			{name}
			dropOnElement
			dropOnPage
			dropValidation
			labelIdle="Drag & Drop your attempt or <span class='filepond--label-action'> Browse </span>"
			allowMultiple={false}
			oninit={handleFilePondInit}
			onaddfile={handleAddFile}
			credits={false}
			allowFileTypeValidation
			acceptedFileTypes={['application/gpx+xml']}
			acceptedFileExtensions={['gpx']}
			maxFiles={1}
			checkValidity
		/>
	</div>
{:else}
	<Details {fileName} />
{/if}

<style global>
	@import 'filepond/dist/filepond.css';
</style>
