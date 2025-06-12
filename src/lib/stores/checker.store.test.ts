import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { isOpen } from './checker.store';

describe('checker store', () => {
  it('should initialise with true', () => {
    expect(get(isOpen)).toBe(true);
  });

  it('should update the value when set', () => {
    isOpen.set(true);
    expect(get(isOpen)).toBe(true);
    
    isOpen.set(false);
    expect(get(isOpen)).toBe(false);
  });

  it('should update the value when using update', () => {
    isOpen.update((value) => !value);
    expect(get(isOpen)).toBe(true);
    
    isOpen.update((value) => !value);
    expect(get(isOpen)).toBe(false);
  });
}); 