<script lang="ts">
	import Map from '../components/Map/Map.svelte';
	import Checker from '../components/Checker/Checker.svelte';
</script>

<main>
	<Map />
	<div class="grid grid-cols-3 gap-4 relative z-10 pointer-events-none">
		<Checker />
		<!-- <div class="col-span-2 h-screen">
      <Breakdown />
    </div> -->
	</div>
</main>
