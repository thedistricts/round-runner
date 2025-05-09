<script lang="ts">
	import type { PageData } from '../../routes/[round=name]/$types';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { gpx } from '$lib/stores/gpx.store';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { ratification } from '$lib/stores/ratification.store';
	import { isOpen } from '$lib/stores/checker.store';
	import { URL_PARAM } from '$lib/enum';

	function reset() {
		gpx.reset();
		ratification.reset();
		breakdown.reset();
	}

	$: logoImgSrc = $page.data.logo as PageData['logo'];
	$: logoAltText = $page.data.title as PageData['title'];
	$: pageUrlSlug = $page.data.slug as PageData['slug'];
	$: rounds = $page.data.rounds as PageData['rounds'];

	function handleRouteSelectChange(event: Event) {
		reset();
		const target = event.target as HTMLSelectElement;
		const isRouteInformation = $page.route.id?.includes(URL_PARAM.ROUTE_INFORMATION);
		const newUrl = isRouteInformation
			? `/${target.value}/${URL_PARAM.ROUTE_INFORMATION}`
			: `/${target.value}`;
		$isOpen = !!isRouteInformation;
		goto(newUrl);
	}
</script>

<header class="flex items-center text-xl">
	<a href="/" class="w-[5rem]">
		<img src={logoImgSrc} alt={`${logoAltText} logo`} class="h-[4rem]" />
	</a>
	<div class="group relative flex w-full pr-3">
		<span
			class="pointer-events-none transition text-gray-500 group-hover:text-gray-900 absolute inset-y-0 right-4 ml-3 flex items-center pr-2"
		>
			<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
		<select
			aria-label="Routes"
			on:change={handleRouteSelectChange}
			id="rounds"
			class="
				appearance-none cursor-pointer
				w-full
				transition
				text-gray-900 text-lg
				group-hover:bg-neutral-100
				rounded-lg focus:ring-blue-500 focus:border-blue-500
				block p-2.5 pl-4 ml-3"
		>
			{#each rounds as round}
				<option selected={pageUrlSlug === round.slug} value={round.slug}>
					{round.title}
				</option>
			{/each}
		</select>
	</div>
</header>
