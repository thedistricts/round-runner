<script lang="ts">
	export let isOpen = false;
</script>

{#if !isOpen}
	<div class="relative flex px-6 py-3 min-h-[52px]">
		<slot />
	</div>
{/if}

{#if isOpen}
	<div
		class="
			relative overflow-y-auto
			before:pointer-events-none 
			before:z-20 before:fixed before:left-0 before:right-4 before:h-16 
			before:bg-gradient-to-b before:from-white before:via-white
			print:before:hidden
			before:hidden md:before:block
		"
	>
		<div class="h-full print:h-auto">
			<div class="px-6 py-3 print:p-0">
				<slot />
			</div>
		</div>
		<div
			class="
				fixed bottom-0 left-0 right-4 h-5 
				bg-gradient-to-t from-white
				pointer-events-none
				print:hidden hidden md:block
			"
		/>
	</div>
{/if}
