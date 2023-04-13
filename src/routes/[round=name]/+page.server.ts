import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
 
export const load = (({ params }) => {
  if (params.round === 'frog-graham-cw') {
    return {
      title: 'Frog Graham Round CW',
      json: '/data/frog-graham-cw.geo.json',
      logo: '/assets/frog-graham.jpg'
    };
  }

  throw error(404);
}) satisfies PageServerLoad;