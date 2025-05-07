/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('tailwindcss-print-styles')],
	variants: {
		extend: {
			display: ['print'],
			overflow: ['print'],
			margin: ['print'],
			padding: ['print'],
			height: ['print'],
			'box-shadow': ['print'],
			shadow: ['print'],
			'drop-shadow': ['print'],
			before: ['print']
		}
	}
};
