<script lang="ts">
	import { viewport } from '$lib/stores/viewport.store';
	$: innerWidth = 1600;
	$: innerHeight = 1200;
	$: viewport.register({ innerWidth: innerWidth, innerHeight: innerHeight });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
