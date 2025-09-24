<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { HOURS, DATE } from '$lib/const';
	import { getMetricsFrom } from '$lib/utils';
	import { gpx } from '$lib/stores/gpx.store';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { ratification, debug } from '$lib/stores/ratification.store';
	import { isRouteReversed } from '$lib/stores/route.store';
	import ValidationWorker from '$lib/workers/validation.worker?worker';
	import type { ExposeValidationWorker } from '$lib/workers/validation.worker.d';
	import { wrap } from 'comlink';

	export let fileName = '';

	dayjs.extend(utc);
	$: date = dayjs($gpx.features?.[0]?.properties.time);
	let start = dayjs();
	let end = dayjs();
	let elapsed = new Date(0);
	let validity = {
		isValid: true,
		isProcessed: false,
		track: { isValid: true },
		timeInterval: { isValid: true, percentileInterval: 0 }
	};

	const worker = new ValidationWorker();
	const { validateTrack, validateTimeIntervals } = wrap<ExposeValidationWorker>(worker);

	const unsubscribe = gpx.subscribe(async (track) => {
		const { start: trackStart, end: trackEnd, elapsed: trackElapsed } = getMetricsFrom(track);

		start = $isRouteReversed ? trackEnd : trackStart;
		end = $isRouteReversed ? trackStart : trackEnd;
		elapsed = trackElapsed;
		if (!track) {
			validity = { ...validity, isProcessed: true, isValid: false };
			return;
		}
		if (track) {
			validity.track = await validateTrack(track);
			if (validity.track.isValid) {
				validity.timeInterval = await validateTimeIntervals(track);
				validity.isValid = validity.track.isValid && validity.timeInterval.isValid;
			}
		}
		validity.isProcessed = true;
	});

	function handleOnResetClick() {
		gpx.reset();
		ratification.reset();
		breakdown.reset();
		debug.reset();
		goto(`/${$page.params.round}`);
	}

	function showBreakdown() {
		breakdown.update((isOpen) => !isOpen);
	}

	onDestroy(() => {
		unsubscribe();
		worker.terminate();
	});
</script>

{#if !validity.isProcessed}
	<div role="status" class="min-h-[140px] animate-pulse bg-gray-100 rounded">
		<span class="sr-only">Loading...</span>
	</div>
{/if}
{#if validity.isProcessed}
	<div
		class="relative text-white px-5 pt-4 pb-6 rounded"
		class:bg-indigo-700={validity.isValid}
		class:bg-red-600={!validity.isValid}
	>
		<div class="pb-2">
			<h2 class="text-lg font-semibold">{fileName}</h2>
			<div
				class="text-xs leading-6"
				class:text-indigo-200={validity.isValid}
				class:text-red-200={!validity.isValid}
			>
				{date.utc().format(DATE)}
			</div>
		</div>

		{#if validity.isValid}
			<div
				class="text-xs leading-5"
				class:text-indigo-200={validity.isValid}
				class:text-red-200={!validity.isValid}
			>
				<p>
					<span class="pr-4">Start: {start.utc().format(HOURS)}</span>
					Finish: {end.utc().format(HOURS)}
				</p>
				<p>
					Est Elapsed Time:
					{elapsed.getUTCHours()} hours
					{elapsed.getUTCMinutes()} minutes
				</p>
			</div>

			<button
				on:click={showBreakdown}
				class="
				flex justify-items-center items-center gap-2
				md:absolute md:bottom-4 md:right-4 mt-5 md:mt-0
				pl-2 pr-3 py-1
				rounded bg-indigo-800 hover:bg-indigo-900 text-indigo-100 text-xs focus:ring-2 focus:ring-indigo-500
				ease-out duration-200
				leading-4
			"
			>
				<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40">
					<path
						fill="currentColor"
						d="M172 896q-23.058 0-39.221-16.163-16.164-16.164-16.164-39.221V311.384q0-23.057 16.164-39.221Q148.942 256 172 256h616q23.058 0 39.221 16.163 16.164 16.164 16.164 39.221v529.232q0 23.057-16.164 39.221Q811.058 896 788 896H172Zm0-30.769h616q9.231 0 16.923-7.692 7.692-7.693 7.692-16.923V311.384q0-9.23-7.692-16.923-7.692-7.692-16.923-7.692H172q-9.231 0-16.923 7.692-7.692 7.693-7.692 16.923v529.232q0 9.23 7.692 16.923 7.692 7.692 16.923 7.692ZM220 756h160v-40H220v40Zm362-88.461L751.539 498 723 469.461l-141 142-57-57L497.461 583 582 667.539ZM220 596h160v-40H220v40Zm0-160h160v-40H220v40Zm-72.615 429.231V286.769v578.462Z"
					/>
				</svg>
				<div>
					<div>Ratification</div>
					Breakdown
				</div>
			</button>
		{/if}

		{#if !validity.isValid}
			{#if !validity.track.isValid}
				<a
					class="text-red-600 text-xs font-medium text-center rounded bg-white translate-y-1 p-3 inline-block w-full"
					href="https://support.strava.com/hc/en-us/articles/216917947-Uploading-GPS-Files-without-Time-Information"
					target="_blank"
				>
					Time information is missing from the file
				</a>
			{/if}
			{#if !validity.timeInterval.isValid}
				<a
					class="text-red-600 text-xs font-medium text-center rounded bg-white translate-y-1 p-3 inline-block w-full"
					href="https://support.strava.com/hc/en-us/articles/216917947-Uploading-GPS-Files-without-Time-Information"
					target="_blank"
				>
					GPS recording interval too low ({validity.timeInterval.percentileInterval}hz)
				</a>
			{/if}
		{/if}

		<button
			on:click={handleOnResetClick}
			type="button"
			class:focus:ring-indigo-500={validity.isValid}
			class:focus:ring-red-500={!validity.isValid}
			class="absolute top-2 right-2 rounded-full p-1 focus:ring-2"
		>
			<span class="sr-only">Reset</span>
			<svg
				class="h-6 w-6"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
{/if}
