import manifast from '$lib/data/round-manifest.json';
import type { LayoutServerLoad } from './$types';


export const load = (() => {
  return {
    rounds: manifast.rounds
  };  
}) satisfies LayoutServerLoad;