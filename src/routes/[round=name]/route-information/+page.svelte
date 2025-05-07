<script lang="ts">
	import { isOpen } from '$lib/stores/checker.store';
	import { beforeUpdate } from 'svelte';
	import { Checkpoints } from '../../../components/Checker/components';

	beforeUpdate(() => {
		isOpen.set(true);
	});
</script>

<Checkpoints />
