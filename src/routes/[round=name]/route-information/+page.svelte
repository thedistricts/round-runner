<script lang="ts">
	import { isOpen } from '$lib/stores/checker.store';
	import { onMount } from 'svelte';
	import { Checkpoints } from '../../../components/Checker/components';

	onMount(() => {
		isOpen.set(true);
	});
</script>

<Checkpoints />
