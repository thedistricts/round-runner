<script lang="ts">
	import { noop } from '$lib/utils';
	export let handleOnClick = noop;
</script>

<button
	on:click={handleOnClick}
	type="button"
	class="relative z-30 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
>
	<svg
		aria-hidden="true"
		class="fill-current w-4 h-4"
		xmlns="https://www.w3.org/2000/svg"
		viewBox="0 96 960 960"
	>
		<path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
	</svg>
	<span class="sr-only">View Checkpoints</span>
</button>
