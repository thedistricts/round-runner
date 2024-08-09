import { Map } from 'maplibre-gl';

export interface MapContext {
	getMap(): Map;
}

const ACCESS_TOKEN = 'V0tBS9icsk79SmCOaKeQ';

const key = Symbol();

export { Map, key, ACCESS_TOKEN };
