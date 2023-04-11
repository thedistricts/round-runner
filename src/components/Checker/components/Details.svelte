<script lang="ts">
	import { onDestroy } from 'svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { HOURS, DATE } from '$lib/const';
	import { gpx } from '$lib/stores/gpx.store';
	import { ratification } from '$lib/stores/ratification.store';

	export let fileName = '';

	dayjs.extend(utc);
	$: date = dayjs($gpx.features?.[0]?.properties.time);

	let times: string[] = [];
	let start = dayjs();
	let end = dayjs();
	let elapsed = new Date(0);
	let hasValidTimes = false;
	let hasCoordinateTimes = false;
	let isValid = false;

	const unsubscribe = gpx.subscribe(() => {
		const coordinates = $gpx.features?.[0]?.geometry?.coordinates ?? [];
		times = $gpx.features?.[0]?.properties?.coordinateProperties?.times ?? [];
		hasValidTimes = coordinates.length === times.length;
		hasCoordinateTimes = times.length > 0;
		isValid = hasCoordinateTimes && hasValidTimes;
		if (isValid) {
			start = dayjs(times?.[0]);
			end = dayjs(times?.[times.length - 1]);
			elapsed = new Date(end.diff(start));
		}
	});

	function handleOnResetClick() {
		gpx.reset();
		ratification.reset();
	}

	onDestroy(unsubscribe);
</script>

<div
	class="relative text-white px-5 pt-4 pb-6 rounded"
	class:bg-indigo-700={isValid}
	class:bg-red-600={!isValid}
>
	<div class="pb-2">
		<h2 class="text-lg font-semibold">{fileName}</h2>
		<div class="text-xs" class:text-indigo-200={isValid} class:text-red-200={!isValid}>
			{date.utc().format(DATE)}
		</div>
	</div>

	{#if isValid}
		<div class="text-xs" class:text-indigo-200={isValid} class:text-red-200={!isValid}>
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
	{/if}

	{#if !isValid}
		<a
			class="text-red-600 text-xs font-medium text-center rounded bg-white translate-y-1 p-3 inline-block w-full"
			href="https://support.strava.com/hc/en-us/articles/216917947-Uploading-GPS-Files-without-Time-Information"
			target="_blank"
		>
			Time information is missing from the file
		</a>
	{/if}

	<button
		on:click={handleOnResetClick}
		type="button"
		class:focus:ring-indigo-500={isValid}
		class:focus:ring-red-500={!isValid}
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
