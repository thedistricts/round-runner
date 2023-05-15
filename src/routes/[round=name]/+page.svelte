<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { beforeUpdate } from 'svelte';
	import { breakdown } from '$lib/stores/breakdown.store';
	import { route } from '$lib/stores/route.store';
	import type { RouteGeoJson } from '$lib/stores/route.store.d';
	import Checker from '../../components/Checker/Checker.svelte';
	import { Breakdown } from '../../components/Breakdown';
	export let data: PageData;

	beforeUpdate(async () => {
		const res = await fetch(data.json);
		const routeGeoJson: RouteGeoJson = await res.json();
		route.set(routeGeoJson);
	});
</script>
<svelte:head>
	<title>{`Round Runner: Validate Your ${data.title} ${data.description}`}</title>
	<meta name="description" content={`Round Runner is an online tool designed to verify and validate your long-distance ${data.description} ${data.title}`}>
	<meta name="keywords" content="Round Runner, Running Verification, Long-Distance Running, Running Rounds, Online Tool, Run Tracking, Distance Verification, Performance Optimization, Frog Graham Round, Tadpole Round, SwimRun Challenge, Swim Run">
	
	<meta property="og:type" content="website">
	<meta property="og:url" content={$page.url.href}>
	<meta property="og:title" content={`Verify Your ${data.title}`}>
	<meta property="og:description" content="Round Runner is an innovative online tool designed to verify and validate your long-distance running rounds. Accurately track and optimize your running performance with our cutting-edge technology.">
	
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content={$page.url.href}>
	<meta property="twitter:title" content={`Verify Your ${data.title}`}>
	<meta property="twitter:description" content="Round Runner is an innovative online tool designed to verify and validate your long-distance running rounds. Accurately track and optimize your running performance with our cutting-edge technology.">
</svelte:head>

<div
	class="
	mr-8 md:mr-0
	grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 
	relative sm:h-screen
	z-10 pointer-events-none
	print:block print:h-auto"
>
	<Checker />

	{#if $breakdown}
		<div class="
			xl:col-span-2 h-screen 
			pointer-events-auto 
			print:h-auto"
		>
			<Breakdown />
		</div>
	{/if}

	<slot />
</div>
