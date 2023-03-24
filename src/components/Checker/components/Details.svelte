

<script lang="ts">
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
	import { gpx } from '../../../stores/gpx.store';

	dayjs.extend(utc);

	// TODO: detect and signpost lack of timing 
	$: date = dayjs($gpx.features?.[0]?.properties.time);
	let times:string[] = [];
	let start = dayjs();
	let end = dayjs();
	let elapsed = dayjs();
	let hasValidTimes = false;
	let hasCoordinateTimes = false;
	let isValid = false;

	gpx.subscribe(() => {
		const coordinates = $gpx.features?.[0]?.geometry?.coordinates ?? [];
		times = $gpx.features?.[0]?.properties?.coordinateProperties?.times ?? [];
		hasValidTimes = coordinates.length === times.length;
		hasCoordinateTimes = times.length > 0;
		isValid = hasCoordinateTimes && hasValidTimes;
    if (isValid) {
      start = dayjs(times?.[0]);
      end = dayjs(times?.[times.length - 1]);
      elapsed = dayjs(start.diff(end, 'milliseconds'));
    }
	})

</script>

<div 
  class="relative text-white px-6 pt-6 pb-7 rounded"
  class:bg-indigo-700={isValid}
  class:bg-red-600={!isValid}
>
  <div class="pb-2">
    <h2 class="text-lg font-semibold">CW-FG-Dan-Nisbet.gpx</h2>	
    <div
      class="text-xs"
      class:text-indigo-200={isValid}
      class:text-red-200={!isValid}
    >
      { date.utc().format('DD MMMM YYYY') }
    </div>
  </div>
  <div 
    class="text-xs"
    class:text-indigo-200={isValid}
    class:text-red-200={!isValid}
  >
    <p>
      <span class="pr-4">Start: { start.utc().format('h:mm a') }</span> 
      Finish: {end.utc().format('h:mm a')}
    </p>
    <p>Est Elapsed Time: {elapsed.format('h [hours] m [minutes]')}</p>
  </div>

  <button
    on:click={gpx.reset}
    type="button"
    class="absolute top-2 right-2 rounded-full p-1 focus:ring-2 focus:ring-indigo-500"
  >
    <span class="sr-only">Reset</span>
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>