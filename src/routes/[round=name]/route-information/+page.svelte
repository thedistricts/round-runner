<script lang="ts">
	import { isOpen } from '$lib/stores/checker.store';
	import { onMount } from 'svelte';
	import { Checkpoints } from '../../../components/Checker/components';
	import { route } from '$lib/stores/route.store';
	import { page } from '$app/stores';
	isOpen.set(true);
	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			if ($page.data.geojson) {
				route.set($page.data.geojson);
			}
		});
		return unsubscribe;
	});
</script>

<Checkpoints />
