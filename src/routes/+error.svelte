<script lang="ts">
	import type { PageData } from './$types';
	import { redirect } from '@sveltejs/kit';
	export let data: PageData;

	const roundDefault = data.rounds.find((round) => round.default);
	throw redirect(307, `/${roundDefault?.slug}`);
</script>
