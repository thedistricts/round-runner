<script lang="ts">
	import { isOpen } from '$lib/stores/checker.store';
	import { noop } from '$lib/utils';
	export let handleOnClick = noop;
	$: buttonClass = $isOpen
		? 'bg-blue-700 border-white text-white'
		: 'text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white';
</script>

<button
	on:click={handleOnClick}
	type="button"
	aria-expanded={$isOpen}
	aria-controls="expander-content"
	class={`relative z-30 border ${buttonClass} focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center`}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="16px"
		viewBox="0 -960 960 960"
		width="16px"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
	</svg>
	<span class="sr-only">View Checkpoints</span>
</button>
