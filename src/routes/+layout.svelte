<script lang="ts">
	import '../app.css';
	import Map from '../components/Map/Map.svelte';
	import WindowBinder from '../bindings/window.binder.svelte';
</script>

<main>
	<WindowBinder />
	<Map />
	<slot />
</main>
