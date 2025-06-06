<script lang="ts">
	import 'filepond/dist/filepond.css';
	import * as FilePondUpload from 'filepond';
	import type { FilePond, FilePondErrorDescription, FilePondFile } from 'filepond';
	import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
	import { onMount, onDestroy } from 'svelte';

	export let handleAddFile: (error: unknown, fileItem: { file: File }) => Promise<void>;
	FilePondUpload.registerPlugin(FilePondPluginFileValidateType);

	let isVisible = false;
	let pond: FilePond | undefined;

	function handleFilePondInit() {
		isVisible = true;
	}

	async function handleFileValidateTypeDetectType(source: File, type: string) {
		const fileName = source.name;
		if (fileName.toLowerCase().endsWith('.gpx')) {
			type = 'application/gpx+xml';
		}
		return type;
	}

	async function handleOnAddFile(error: FilePondErrorDescription | null, file: FilePondFile) {
		if (error) {
			console.error('Error adding file:', error);
			return;
		}
		handleAddFile(error, { file: file.file as File });
	}

	const IDLE_MESSAGE =
		"Drag & Drop your attempt or <span class='filepond--label-action'> Browse </span>";

	onMount(() => {
		const inputElement = document.querySelector('input[type="file"]');
		if (inputElement) {
			pond = FilePondUpload.create(inputElement, {
				oninit: handleFilePondInit,
				acceptedFileTypes: ['application/gpx+xml'],
				allowFileTypeValidation: true,
				labelFileTypeNotAllowed: 'Please upload a GPX file',
				fileValidateTypeLabelExpectedTypes: 'Only GPX files are allowed',
				fileValidateTypeDetectType: handleFileValidateTypeDetectType,
				allowDrop: true,
				allowReplace: true,
				dropOnElement: true,
				dropOnPage: true,
				dropValidation: true,
				allowMultiple: false,
				labelIdle: IDLE_MESSAGE,
				credits: false,
				onaddfile: handleOnAddFile
			});
		}
	});

	onDestroy(() => {
		if (pond) {
			pond.destroy();
		}
	});
</script>

<div class="filepond__wrapper">
	<div
		class:!opacity-1={isVisible}
		class:!opacity-0={!isVisible}
		class="filepond__wrapper transition-opacity duration-500 delay-200 print:hidden"
	>
		<input type="file" class="filepond" />
	</div>
</div>

<style>
	input[type='file'] {
		display: none;
	}
	.filepond__wrapper {
		background-color: #f1f0ef;
		border-radius: 0.5rem;
		min-height: 4.75rem;
		margin-bottom: 1rem;
	}
	.filepond {
		margin-bottom: 0px;
	}
</style>
