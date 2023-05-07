<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from '../../routes/[round=name]/$types';
	import { page } from '$app/stores';
	const { title, logo, slug, rounds } = $page.data as PageData;

	function handleRouteSelectChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		goto(target.value);
	}
</script>

<header class="flex items-center text-xl">
	<img src={logo} alt={`${title} logo`} class="h-16" />
	<div class="relative flex w-full pr-3">
		<span class="pointer-events-none absolute inset-y-0 right-4 ml-3 flex items-center pr-2">
			<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
		<select
			on:change={handleRouteSelectChange}
			id="rounds"
			class="
				appearance-none
				w-full 
			text-gray-900 text-lg 
				rounded-lg focus:ring-blue-500 focus:border-blue-500 
				block p-2.5 ml-3"
		>
			{#each rounds as round}
				<option selected={slug === round.slug} value={round.slug}>
					{round.title}
				</option>
			{/each}
		</select>
	</div>
</header>
