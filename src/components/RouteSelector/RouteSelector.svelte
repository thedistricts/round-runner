<script lang="ts">
	import { page } from '$app/stores';
	const { title, logo } = $page.data;
</script>

<header class="flex items-center text-xl">
	<img src={logo} alt={`${title} logo`} class="h-16" />
	<h1 class="px-6">{title}</h1>
</header>
