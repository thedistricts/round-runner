import { describe, it, expect } from 'vitest';
import { kilometersToMeters } from './units';

describe('units', () => {
	describe('kilometersToMeters', () => {
		it('should convert kilometers to meters', () => {
			expect(kilometersToMeters(1)).toBe('1000');
			expect(kilometersToMeters(2.5)).toBe('2500');
			expect(kilometersToMeters(0.5)).toBe('500');
		});

		it('should return 0 when no distance is provided', () => {
			expect(kilometersToMeters()).toBe('0');
			expect(kilometersToMeters(undefined)).toBe('0');
		});
	});
}); 