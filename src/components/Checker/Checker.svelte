<script lang="ts">
	import { Upload, Checkpoints } from './components';
	$: isOpen = false;
	function handleOnClick() {
		isOpen = !isOpen;
	}
</script>

<div class="h-screen pointer-events-auto">
	<div
		class:expanded={isOpen}
		class="bg-white rounded-md drop-shadow divide-y divide-slate-200 m-8 mr-0"
	>
		<header class="flex items-center text-xl">
			<img src="./assets/frog-graham.jpg" alt="Frog Graham logo" class="h-16" />
			<h1 class="px-6">Frog Graham Round</h1>
		</header>
		<div class="p-6">
			<Upload />
		</div>
		<Checkpoints {isOpen}>
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
				<span class="sr-only">Icon description</span>
			</button>
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
