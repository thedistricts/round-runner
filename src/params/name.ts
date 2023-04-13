import type { ParamMatcher } from '@sveltejs/kit';
 
export const match = ((param) => {
  return param === 'frog-graham-cw';
}) satisfies ParamMatcher;