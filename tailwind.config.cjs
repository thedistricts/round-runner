/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		require('tailwindcss-print-styles')
	],
	variants: {
		display: ['print'],
		overflow: ['print'],
		margin: ['print'],
		padding: ['print'],
		height: ['print'],
		"drop-shadow": ['print'],
  }
};
