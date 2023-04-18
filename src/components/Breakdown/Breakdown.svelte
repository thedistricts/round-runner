<script lang="ts">
	import { onDestroy } from 'svelte';
	import { gpx } from '$lib/stores/gpx.store';

	import dayjs from 'dayjs';
	import { DATE, HOURS } from '$lib/const';
	import { getMetricsFrom, getMetricsDefaults } from '$lib/utils';
	import { submissionPoints } from '$lib/stores/ratification.store';
	let metrics = getMetricsDefaults();
	const unsubscribe = gpx.subscribe((track) => {
		metrics = getMetricsFrom(track);
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
</script>

<article class="p-8 pl-0 h-full print:h-auto print:p-0">
	<div
		class="
		bg-white rounded-md drop-shadow
		pb-5 h-full
		overflow-auto
		print:overflow-visible
		print:drop-shadow-none
		print:p-0
		"
	>
		<header class="border-b px-6 py-4 flex items-center sticky top-0 z-10 bg-white print:px-0">
			<h4 class="text-xl">Ratification Breakdown</h4>
		</header>

		<div class="px-6 print:p-0">
			<div class="flex justify-between gap-3 pt-5 pb-6 text-gray-600">
				<div>Date: {metrics.start.utc().format(DATE)}</div>
				<div>Start: {metrics.start.utc().format(HOURS)}</div>
				<div>End: {metrics.end.utc().format(HOURS)}</div>
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
							<tr class="bg-white border-b ">
								<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									{getOrderLabel(order)}
								</th>
								<td class="px-6 py-5"> {ratificationFeature.properties.name} </td>
								<td class="px-6 py-5">
									{#if ratificationFeature.properties.time}
										{dayjs(ratificationFeature.properties.time).format(HOURS)}
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
