export async function get() {
	const res = await fetch('../data/frog-graham.json');
	const data = await res.json();
	return {
		body: {
			data
		}
	};
}
