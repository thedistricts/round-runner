<script lang="ts">
	import * as Comlink from 'comlink';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// TODO: also allow .KML files?
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';
	import { page } from '$app/stores';
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
	import type { PageData } from '../../../routes/[round=name]/$types';


	let ratificationWorker: Worker;
	$: isDebug = false;
	$: pageRouteExampleURL = $page.data.example as PageData['example'];

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
		console.log(fileItem.file)
		const data: GPXGeoJson = await load(fileItem.file, GPXLoader);
		gpx.set(data);
		fileName = fileItem.file.name;
		const { ratify, debug } = Comlink.wrap<ExposeRatificationWorker>(ratificationWorker);
		const ratificationResult = await ratify({ track: data, route: $route });
		ratificationStore.set(ratificationResult);
		if(isDebug) {
			const ratificationDebugResult = await debug({ track: data, route: $route });
			debugStore.set(ratificationDebugResult);
		}
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
	
	function handleLoadExample(URL: string) {
		console.log(URL)
		fetchFileFromUrl(URL);
	}

	async function fetchFileFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "example.gpx", { type: blob.type });
    handleAddFile(null, { file });
  }

	onMount(() => {
		if (browser) {
			const urlParams = new URLSearchParams(window.location.search);
			isDebug = urlParams.has('debug');
		}
	});

	onDestroy(terminateWorker);
</script>

{#if $gpx.features.length === 0}
	<div
		class:!opacity-1={isVisible}
		class:!opacity-0={!isVisible}
		class:!h-28={pageRouteExampleURL}
		class:!h-20={!pageRouteExampleURL}
		class="transition-opacity duration-500 delay-200 print:hidden"
	>
		<FilePond
			{name}
			id={name}
			oninit={handleFilePondInit}
			onaddfile={handleAddFile}
			allowFileTypeValidation={true}
			acceptedFileTypes={['.gpx']}
			dropOnElement
			dropOnPage
			dropValidation
			allowMultiple={false}
			labelIdle={IDLE_MESSAGE}
			credits={false}
		/>
		{#if pageRouteExampleURL}
		<div class="flex flex-row items-center text-sm text-neutral-400">
			No file? 
			<button
				class="
					ml-2 py-1 px-3 rounded-md bg-neutral-50
				text-blue-700 border  border-neutral-50 hover:bg-blue-700 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500
				"
				on:click={() => handleLoadExample(pageRouteExampleURL)}
			>
				Load an example
			</button>
		</div>
		{/if}
		
	</div>
{:else}
	<Details {fileName} />
{/if}

<style global>
	@import 'filepond/dist/filepond.css';
</style>
