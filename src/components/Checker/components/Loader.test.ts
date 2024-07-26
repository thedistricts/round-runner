/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Loader from './Loader.svelte';

describe('Loader component', () => {
  it('should render correctly', () => {
    const { container } = render(Loader);
    expect(container).toMatchSnapshot();
  });
});