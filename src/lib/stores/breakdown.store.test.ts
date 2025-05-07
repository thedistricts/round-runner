import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { breakdown } from './breakdown.store';

describe('breakdown store', () => {
  it('should initialize with false', () => {
    expect(get(breakdown)).toBe(false);
  });

  it('should update the value when set', () => {
    breakdown.set(true);
    expect(get(breakdown)).toBe(true);
    
    breakdown.set(false);
    expect(get(breakdown)).toBe(false);
  });

  it('should update the value when using update', () => {
    breakdown.update((value) => !value);
    expect(get(breakdown)).toBe(true);
    
    breakdown.update((value) => !value);
    expect(get(breakdown)).toBe(false);
  });

  it('should reset to false', () => {
    breakdown.set(true);
    breakdown.reset();
    expect(get(breakdown)).toBe(false);
  });
}); 