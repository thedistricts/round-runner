/**
 * @vitest-environment jsdom
 */
import { get } from "svelte/store";
import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Checkpoints from './Checkpoints.svelte';
import { route, routeFocus }  from '$lib/stores/route.store';

describe('Checkpoints component', () => {
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

  it('should render the correct number of checkpoints', () => {
    render(Checkpoints, { isOpen: true });
    const checkpointElements = screen.getAllByRole('button');
    expect(checkpointElements.length).toBe(2);
  });

  it('should call handleOnMapFocus with the correct coordinates when a checkpoint button is clicked', async () => {
    render(Checkpoints, { isOpen: true });
    const checkpointButtonElement = screen.getByText(/1:Checkpoint 1/);
    fireEvent.click(checkpointButtonElement);
    expect(get(routeFocus)).toEqual([-122.4194, 37.7749]);
  });
});