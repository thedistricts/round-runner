<script lang="ts">
	import * as Comlink from 'comlink';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { URL_PARAM } from '$lib/enum';

	// TODO: also allow .KML files?
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';
	import { page } from '$app/stores';
	import { route, isRouteReversed } from '$lib/stores/route.store';
	import { gpx } from '$lib/stores/gpx.store';
	import {
		ratification as ratificationStore
		// debug as debugStore
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

	function handleOnClick() {
		if (browser) {
			goto(`/${$page.params.round}/${URL_PARAM.RATIFICATION}`);
		}
	}

	async function handleAddFile(_err: unknown, fileItem: { file: File }) {
		handleOnClick();
		loadWorker();

		const data: GPXGeoJson = await load(fileItem.file, GPXLoader);
		gpx.set(data);

		fileName = fileItem.file.name;
		const { ratify, debug } = Comlink.wrap<ExposeRatificationWorker>(ratificationWorker);
		const ratificationResult = await ratify(data, $route);
		ratificationStore.set(ratificationResult);

		// if (isDebug) {
		// 	const ratificationDebugResult = await debug(data, $route);
		// 	debugStore.set(ratificationDebugResult);
		// }

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
		fetchFileFromUrl(URL);
	}

	function reverseRoute() {
		const reversedRoute = {
			...$route,
			features: []
		};
		isRouteReversed.set(!$isRouteReversed);
		route.set(reversedRoute);
	}

	async function fetchFileFromUrl(url: string) {
		const response = await fetch(url);
		const blob = await response.blob();
		const file = new File([blob], 'Round Attempt Example', { type: blob.type });
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
		data-testid="filepond-wrapper"
	>
		<FilePond
			{name}
			id={name}
			oninit={handleFilePondInit}
			onaddfile={handleAddFile}
			acceptedFileTypes={['.gpx']}
			allowDrop={true}
			allowReplace={true}
			dropOnElement={true}
			dropOnPage={true}
			dropValidation={false}
			allowMultiple={false}
			labelIdle={IDLE_MESSAGE}
			credits={false}
		/>
		{#if pageRouteExampleURL}
			<div class="flex flex-row items-center text-sm text-neutral-400">
				No file?
				<button
					class="
				ml-2 py-1 px-3 rounded-full bg-neutral-50
				text-blue-700 border border-neutral-50 hover:bg-blue-700 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500
				"
					on:click={() => handleLoadExample(pageRouteExampleURL)}
				>
					See example
				</button>
				<label class="ml-auto inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						value=""
						class="sr-only peer"
						on:change={reverseRoute}
						checked={$isRouteReversed}
					/>
					<div
						class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
					/>
					<span class="ms-3 text-sm font-normal text-gray-500">CCW</span>
				</label>
			</div>
		{/if}
	</div>
{:else}
	<Details {fileName} />
{/if}
