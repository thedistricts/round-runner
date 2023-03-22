<script lang="ts">
	import { Upload, Checkpoints } from './components';
</script>


<div class="p-8 pr-0 pointer-events-auto">
	<div class="bg-white rounded-md drop-shadow divide-y divide-slate-200">
		<header class="flex items-center text-xl">
			<img src="./assets/frog-graham.jpg" alt="Frog Graham logo" class="h-16" />
			<h1 class="px-6">Frog Graham Round</h1>
		</header>
		<div class="p-6">
			<Upload />
		</div>
		<Checkpoints />
	</div>
</div>
