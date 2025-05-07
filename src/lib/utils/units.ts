export function kilometersToMeters(dist?: number) {
	if (!dist) return '0';
	return Number(dist * 1000).toFixed(0);
}
