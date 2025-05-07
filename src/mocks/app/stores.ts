import { vi } from 'vitest';
import { writable } from 'svelte/store';

export const page = writable({
  params: {
    round: 'test-round',
    showInfo: false
  }
});

export const navigating = {
  subscribe: vi.fn()
};

export const updated = {
  subscribe: vi.fn()
}; 