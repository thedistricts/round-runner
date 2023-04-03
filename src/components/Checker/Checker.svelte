<script lang="ts">
	import { VALIDITY } from '$lib/enum';
	import { Upload, Checkpoints } from './components';
	import { ratification } from '$lib/stores/ratification.store';
	import type { RatificationResults } from '$lib/stores/ratification.store.d';
	import { gpx } from '$lib/stores/gpx.store';

	type FilteredRatificationResults = {
		valids?: RatificationResults;
		invalids?: RatificationResults;
		warnings?: RatificationResults;
	};

	let isOpen = false;
	let hasGpx = false;
	let hasRatificationResults = false;
	let ratificationResults: FilteredRatificationResults = {
		valids: undefined,
		invalids: undefined,
		warnings: undefined
	};
	function handleOnClick() {
		isOpen = !isOpen;
	}

	gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
		if (hasGpx) {
			isOpen = true;
		}
	});

	ratification.subscribe((results) => {
		// TODO: better way to pre-calculate this in the store?
		hasRatificationResults = results.length > 0;
		ratificationResults.valids = results.filter(
			(feature) => feature.properties.valid === VALIDITY.VALID
		);
		ratificationResults.invalids = results.filter(
			(feature) => feature.properties.valid === VALIDITY.FAIL
		);
		ratificationResults.warnings = results.filter(
			(feature) => feature.properties.valid === VALIDITY.WARN
		);
	});

	// TODO: ratification processing should show a loading skeleton
	// TODO: tidy up component structure
	// TODO: create spinner component
</script>

<div class="h-screen">
	<div
		class:expanded={isOpen}
		class="pointer-events-auto bg-white rounded-md drop-shadow divide-y divide-slate-200 m-8 mr-0"
	>
		<header class="flex items-center text-xl">
			<img src="./assets/frog-graham.jpg" alt="Frog Graham logo" class="h-16" />
			<h1 class="px-6">Frog Graham Round</h1>
		</header>
		<div class="p-6">
			<Upload />
		</div>
		<Checkpoints {isOpen} hasResults={hasRatificationResults}>
			{#if hasGpx}
				{#if hasRatificationResults}
					<div>valid: {ratificationResults.valids?.length}</div>
					<div>invalids: {ratificationResults.invalids?.length}</div>
					<div>warnings: {ratificationResults.warnings?.length}</div>
				{/if}
				{#if !hasRatificationResults}
					<div class="text-center py-3">
						<div role="status">
							<svg
								aria-hidden="true"
								class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-200 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				{/if}
			{/if}
			{#if !hasGpx}
				<button
					on:click={handleOnClick}
					type="button"
					class="absolute top-3 right-6 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
				>
					<svg
						aria-hidden="true"
						class="fill-current w-4 h-4"
						xmlns="https://www.w3.org/2000/svg"
						viewBox="0 96 960 960"
					>
						<path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
					</svg>
					<span class="sr-only">Close</span>
				</button>
			{/if}
		</Checkpoints>
	</div>
</div>

<style>
	.expanded {
		display: grid;
		grid-template-rows: 4rem auto 1fr;
		height: calc(100vh - 4rem);
	}
</style>
