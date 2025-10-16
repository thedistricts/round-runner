<script lang="ts">
	import '../app.css';
	import Map from '../components/Map/Map.svelte';
	import WindowBinder from '../bindings/window.binder.svelte';

	// Accept props passed by SvelteKit even if not used
	export let data: any = undefined;
	export let params: any = undefined;
</script>

<main>
	<WindowBinder />
	<Map />
	<slot />
</main>
