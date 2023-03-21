<script lang="ts">
	import FilePond from 'svelte-filepond';
	let pond;
	let name = 'filepond';
	let isVisible = false;

	function handleInit() {
		isVisible = true;
	}

	function handleAddFile(err: unknown, fileItem: { file: File }) {
		const reader = new FileReader();
		reader.onload = (evt: ProgressEvent) => {
			console.log('onload ', evt.target);
		};
		reader.readAsText(fileItem.file);
		console.log('A file has been added', fileItem);
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
