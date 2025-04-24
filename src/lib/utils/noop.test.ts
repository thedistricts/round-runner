import { describe, it, expect } from 'vitest';
import { noop } from './noop';

describe('noop', () => {
	it('should be a function that does nothing', () => {
		expect(noop).toBeInstanceOf(Function);
		expect(noop()).toBeUndefined();
	});
}); 