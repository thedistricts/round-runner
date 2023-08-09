/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Checker from './Checker.svelte';
import { route } from '$lib/stores/route.store';

vi.mock('$lib/stores/ratification.store', () => ({
  ratification: {
    reset: vi.fn(),
  },
}));

describe('Checker component', () => {

  beforeEach(() => {
    route.set({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 1', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        },
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 2', leg: 1, featureType: 'checkpoint'  },
          geometry: { type: 'Point', coordinates: [-122.4192, 37.7751] },
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the route selector', () => {
    render(Checker);
    const routeSelectorElement = screen.getByText('View Checkpoints');
    expect(routeSelectorElement).toBeInTheDocument();
  });

  it('should not render the children when closed', () => {
    render(Checker);
    const childrenCheckpointCountElement = screen.getByText(/2Checkpoints/);
    expect(childrenCheckpointCountElement).toBeInTheDocument();
    const childrenCheckpointElements = screen.queryAllByText(/:Checkpoint/);
    expect(childrenCheckpointElements).toHaveLength(0);
  });

  it('should render the children when open', async () => {
    render(Checker);
    const expander = screen.getByText('View Checkpoints');
    await fireEvent.click(expander);
    const childrenCheckpointCountElement = screen.getByText(/2Checkpoints/);
    const childrenCheckpointElements = screen.queryAllByText(/:Checkpoint/);
    const childrenCheckpointElement = screen.getByText(/1:Checkpoint 1/);
    expect(childrenCheckpointCountElement).toBeInTheDocument();
    expect(childrenCheckpointElement).toBeInTheDocument();
    expect(childrenCheckpointElements).toHaveLength(2);
  });
});