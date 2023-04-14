<script lang="ts">
	import dayjs from 'dayjs';
	import { HOURS } from '$lib/const';
	import { ratification } from '$lib/stores/ratification.store';
</script>

<article class="p-8 pl-0 h-full">
	<div class="bg-white rounded-md drop-shadow pb-5 h-full overflow-auto">
		<header class="border-b px-6 py-4 flex items-center sticky top-0 z-10 bg-white">
			<h4 class="text-xl">Ratification Breakdown</h4>
		</header>

		<div class="px-6">
			<div class="flex justify-between gap-3 pt-5 pb-6 text-gray-600">
				<div>Date:</div>
				<div>Start:</div>
				<div>End:</div>
				<div>Estimated Elapsed Time:</div>
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
						{#each $ratification as ratificationFeature}
							<tr class="bg-white border-b ">
								<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									{ratificationFeature.properties.order}
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
