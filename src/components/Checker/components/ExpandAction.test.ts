/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/svelte';
import ExpandAction from './ExpandAction.svelte';

describe('ExpandAction component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should call handleOnClick when the button is clicked', async () => {
    const handleOnClick = vi.fn();
    render(ExpandAction, { handleOnClick });
    const buttonElement = screen.getByRole('button');
    await fireEvent.click(buttonElement);
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });
});