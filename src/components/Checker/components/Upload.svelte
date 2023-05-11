<script lang="ts">
	import * as Comlink from 'comlink';
	import { onDestroy } from 'svelte';

	// TODO: also allow .KML files?
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';

	import { route } from '$lib/stores/route.store';
	import { gpx } from '$lib/stores/gpx.store';
	import {
		ratification as ratificationStore,
		debug as debugStore
	} from '$lib/stores/ratification.store';
	import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

	import FilePond, { registerPlugin } from 'svelte-filepond';
	import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
	import Details from './Details.svelte';

	import RatificationWorker from '$lib/workers/ratification.worker?worker';
	import type { ExposeRatificationWorker } from '$lib/workers/ratification.worker.d';

	let ratificationWorker: Worker;
	let name = 'filepond';
	let isVisible = false;
	let fileName = '';
	const IDLE_MESSAGE =
		"Drag & Drop your attempt or <span class='filepond--label-action'> Browse </span>";

	registerPlugin(FilePondPluginFileValidateType);

	function handleFilePondInit() {
		isVisible = true;
	}

	async function handleAddFile(_err: unknown, fileItem: { file: File }) {
		loadWorker();
		const data: GPXGeoJson = await load(fileItem.file, GPXLoader);
		gpx.set(data);
		fileName = fileItem.file.name;
		const { ratify, debug } = Comlink.wrap<ExposeRatificationWorker>(ratificationWorker);
		const ratificationResult = await ratify({ track: data, route: $route });
		const ratificationDebugResult = await debug({ track: data, route: $route });
		ratificationStore.set(ratificationResult);
		debugStore.set(ratificationDebugResult);
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

	onDestroy(terminateWorker);
</script>

{#if $gpx.features.length === 0}
	<div
		class:opacity-1={isVisible}
		class:opacity-0={!isVisible}
		class="h-20 transition-opacity duration-500 delay-200 print:hidden"
	>
		<FilePond
			{name}
			oninit={handleFilePondInit}
			onaddfile={handleAddFile}
			allowFileTypeValidation={true}
			acceptedFileTypes={['application/xml']}
			acceptedFileExtensions={['gpx']}
			dropOnElement
			dropOnPage
			dropValidation
			allowMultiple={false}
			labelIdle={IDLE_MESSAGE}
			credits={false}
		/>
	</div>
{:else}
	<Details {fileName} />
{/if}

<style global>
	@import 'filepond/dist/filepond.css';
</style>
