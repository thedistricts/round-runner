<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import { onMount, beforeUpdate } from 'svelte';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { route } from '$lib/stores/route.store';
	import { isOpen } from '$lib/stores/checker.store';
	import type { RouteGeoJson } from '$lib/stores/route.store.d';
	import Checker from '../../components/Checker/Checker.svelte';
	import { Breakdown } from '../../components/Breakdown';
	export let data: PageData['rounds'][0];

	let currentRouteSlug = '';

	beforeUpdate(async () => {
		if (data.slug !== currentRouteSlug) {
			const res = await fetch(data.json);
			const routeGeoJson: RouteGeoJson = await res.json();
			route.set(routeGeoJson);
			currentRouteSlug = data.slug;
		}
	});

	onMount(() => {
		isOpen.set(false);
	});
</script>

<svelte:head>
	<title>{`Round Runner: Explore & View The ${data.title} Route`}</title>
	<meta
		name="description"
		content={`Round Runner is an online tool designed to help plan, explore and verify your long-distance ${data.description} ${data.title} route. View the route, check the checkpoints and download the .gpx route waypoints to help plan your navigation.`}
	/>
	<meta
		name="keywords"
		content={`Ultra Running, Long-Distance Ultras, Ultra Challenges, Run Tracking, Performance, ${data.title}, SwimRun Challenge, Swim Run, RunSwim`}
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={`${data.title}`} />
	<meta
		property="og:description"
		content="Round Runner is an online tool designed to help plan, explore and verify your long-distance challenges."
	/>

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta property="twitter:title" content={`${data.title}`} />
	<meta
		property="twitter:description"
		content="Round Runner is an online tool designed to help plan, explore and verify your long-distance challenges."
	/>
</svelte:head>

<div
	class="
	mr-8 md:mr-0
	grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4
	relative sm:h-screen
	z-10 pointer-events-none
	print:block print:h-auto"
>
	<Checker>
		<slot />
	</Checker>

	{#if $breakdown}
		<div
			class="
			xl:col-span-2 h-screen
			pointer-events-auto
			print:h-auto"
		>
			<Breakdown />
		</div>
	{/if}
</div>
