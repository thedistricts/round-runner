<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gpx } from '$lib/stores/gpx.store';

	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';

	import { DATE, HOURS } from '$lib/const';
	import { getMetricsFrom, getMetricsDefaults } from '$lib/utils';
	import { submissionPoints } from '$lib/stores/ratification.store';
	import { breakdown } from '$lib/stores/breakdown.store';

	dayjs.extend(utc);
	let start = dayjs();
	let end = dayjs();
	let breakdownDomElement: HTMLElement;

	let metrics = getMetricsDefaults();
	const unsubscribe = gpx.subscribe((track) => {
		metrics = getMetricsFrom(track);
		start = metrics.start;
		end = metrics.end;
	});

	onMount(() => {
		breakdownDomElement.scrollIntoView({ behavior: 'smooth' });
	});

	onDestroy(unsubscribe);

	function getOrderLabel(order: number) {
		if (order === 0) {
			return 'Start';
		}
		if (order === $submissionPoints.length - 1) {
			return 'Finish';
		}
		return order;
	}

	function removeDescriptiveLabel(label: string) {
		return label.replace('(Start)', '').replace('(Finish)', '');
	}

	function handleOnBreakdownCloseClick() {
		breakdown.set(false);
	}
</script>

<article
	class="pl-8 pb-8 md:p-8 md:pl-0 md:h-full print:h-auto print:p-0 scroll-mt-10"
	bind:this={breakdownDomElement}
>
	<div
		class="
		bg-white rounded-md drop-shadow
		pb-5 md:h-full
		md:overflow-auto
		print:overflow-visible
		print:drop-shadow-none
		print:p-0
		"
	>
		<header class="border-b px-6 py-4 flex items-center sticky top-0 z-10 bg-white print:px-0">
			<h4 class="text-xl">Ratification Breakdown</h4>
			<button
				class="ml-auto rounded-full p-1 focus:ring-2 focus:ring-indigo-500"
				on:click={handleOnBreakdownCloseClick}
			>
				<span class="sr-only">Close</span>
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
		</header>

		<div class="px-6 print:p-0">
			<div class="flex justify-between gap-3 pt-5 pb-6 text-gray-600">
				<div>Date: {start.utc().format(DATE)}</div>
				<div>Start: {start.utc().format(HOURS)}</div>
				<div>End: {end.utc().format(HOURS)}</div>
				<div>
					Elapsed Time: {metrics.elapsed.getUTCHours()} hours
					{metrics.elapsed.getUTCMinutes()} minutes
				</div>
			</div>

			<div class="relative overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 border">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
						<tr>
							<th scope="col" class="px-6 py-4"> <span class="invisible">Order</span> </th>
							<th scope="col" class="px-6 py-4"> Location </th>
							<th scope="col" class="px-6 py-4"> Split time </th>
							<th scope="col" class="px-6 py-4"> Notes </th>
						</tr>
					</thead>
					<tbody>
						{#each $submissionPoints as ratificationFeature, order}
							<tr class="bg-white border-b">
								<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									{getOrderLabel(order)}
								</th>
								<td class="px-6 py-5">
									{removeDescriptiveLabel(ratificationFeature.properties.name)}
								</td>
								<td class="px-6 py-5">
									{#if ratificationFeature.properties.time}
										{dayjs(ratificationFeature.properties.time).utc().format(HOURS)}
									{/if}
								</td>
								<td class="px-6 py-5">
									{ratificationFeature.properties?.notes ?? ''}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</article>
