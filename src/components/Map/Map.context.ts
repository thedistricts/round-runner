import { Map } from 'maplibre-gl';

export interface MapContext {
	getMap(): Map;
}

const ACCESS_TOKEN = 'vAj4p8zLweqLaTgqeczQUCqAAjep2E34';

const key = Symbol();

export { Map, key, ACCESS_TOKEN };
