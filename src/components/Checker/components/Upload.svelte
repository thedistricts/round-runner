<script lang="ts">
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';
	import { gpx } from '../../../stores/gpx.store';
	import FilePond from 'svelte-filepond';
	let pond;
	let name = 'filepond';
	let isVisible = false;

	function handleInit() {
		isVisible = true;
	}
	// TODO:  hand off to service worker
	async function handleAddFile(err: unknown, fileItem: { file: File }) {
		const data = await load(fileItem.file, GPXLoader);
		gpx.set(data);
	}
</script>

<div class="h-20 transition-opacity duration-500 delay-200 {isVisible ? 'opacity-1' : 'opacity-0'}">
	<FilePond
		bind:this={pond}
		{name}
		allowMultiple={false}
		oninit={handleInit}
		onaddfile={handleAddFile}
		credits={false}
	/>
</div>

<style global>
	@import 'filepond/dist/filepond.css';
</style>
