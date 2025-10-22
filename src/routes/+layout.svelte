<script lang="ts">
	import '../app.css';
	import Map from '../components/Map/Map.svelte';
	import WindowBinder from '../bindings/window.binder.svelte';
	export let data: any = undefined;
	export let params: any = undefined;
</script>

<main>
	<WindowBinder />
	<Map />
	<slot />
</main>
