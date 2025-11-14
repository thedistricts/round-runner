<script lang="ts">
	import Overview from '../components/Overview/Overview.svelte';
</script>

<svelte:head>
	<title>{`Round Runner: Plan, explore & verify your long-distance challenges`}</title>
	<meta
		name="description"
		content={`A tool to make planning and ratification easier. Workout split times by stage and download .gpx route waypoints to help plan your navigation.`}
	/>
	<meta
		name="keywords"
		content={`Ultra Running, Long-Distance Ultras, Ultra Challenges, Run Tracking, Performance, SwimRun Challenge, Swim Run, Download routes, GPX route`}
	/>

	<meta
		property="twitter:description"
		content="Round Runner is an online tool designed help plan, explore and verify your long-distance challenges."
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
