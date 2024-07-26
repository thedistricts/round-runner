/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import * as navigation from '$app/navigation';
import { gpx } from '$lib/stores/gpx.store';
import { breakdown } from '$lib/stores/breakdown.store';
import { ratification } from '$lib/stores/ratification.store';
import RouteSelector from './RouteSelector.svelte';

describe('RouteSelector component', () => {
  
  beforeEach(async () => {
      vi.mock('$lib/stores/gpx.store', () => ({
        gpx: {
          reset: vi.fn(),
        },
      }));

      vi.mock('$lib/stores/breakdown.store', () => ({
        breakdown: {
          reset: vi.fn(),
        },
      }));

      vi.mock('$lib/stores/ratification.store', () => ({
        ratification: {
          reset: vi.fn(),
        },
      }));
    
      vi.mock('$app/navigation', () => ({
        goto: vi.fn()
      }));
  })

  afterEach(() => {
    cleanup();
  });

  it('should render the logo, select, and options', () => {
    render(RouteSelector);
    const logo = screen.getByAltText('Title logo')
    const select = screen.getByDisplayValue('Round 1');
    const options = screen.getAllByRole('option');
    expect(logo).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(options).toHaveLength(2);
    
  });

  it('should reset the stores and navigate to the selected round on change', async () => {
    const gpxReset = vi.spyOn(gpx, 'reset');
    const breakdownReset = vi.spyOn(breakdown, 'reset');
    const ratificationReset = vi.spyOn(ratification, 'reset');
    const gotoMock = vi.spyOn(navigation, 'goto');

    render(RouteSelector);
    const select = screen.getByDisplayValue('Round 1');
    await fireEvent.change(select, { target: { value: 'round-2' } });

    expect(gpxReset).toHaveBeenCalled();
    expect(breakdownReset).toHaveBeenCalled();
    expect(ratificationReset).toHaveBeenCalled();
    expect(gotoMock).toHaveBeenCalledWith('round-2');
  });
});