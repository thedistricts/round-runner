<script lang="ts">
	import Overview from '../components/Overview/Overview.svelte';
</script>

<svelte:head>
	<title>{`Round Runner: Plan, explore & verify your long-distance challenges`}</title>
	<meta
		name="description"
		content={`Round Runner is an online tool designed to verify and validate your long-distance challenges`}
	/>
	<meta
		name="keywords"
		content={`Ultra Running, Long-Distance Ultras, Ultra Challenges, Run Tracking, Performance, SwimRun Challenge, Swim Run`}
	/>

	<!-- <meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={`${data.title}`} />
	<meta
		property="og:description"
		content="Round Runner is an online tool designed to verify and validate your long-distance challenges."
	/>

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta property="twitter:title" content={`${data.title}`} />
	 -->
	<meta
		property="twitter:description"
		content="Round Runner is an online tool designed to verify and validate your long-distance challenges."
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
	<Overview />
	<slot />
</div>
