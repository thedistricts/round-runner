<script lang="ts">
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { GPXLoader } from '@loaders.gl/kml';
	import { load } from '@loaders.gl/core';
	import { gpx } from '../../../stores/gpx.store';
	import FilePond from 'svelte-filepond';
	import Details from './Details.svelte';

	dayjs.extend(utc);

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

{#if $gpx.features.length === 0}
	<div
		class:opacity-1={isVisible}
		class:opacity-0={!isVisible}
		class="h-20 transition-opacity duration-500 delay-200"
	>
		<FilePond
			bind:this={pond}
			{name}
			allowMultiple={false}
			oninit={handleInit}
			onaddfile={handleAddFile}
			credits={false}
		/>
	</div>
{:else}
	<Details />
{/if}

<style global>
	@import 'filepond/dist/filepond.css';
</style>
