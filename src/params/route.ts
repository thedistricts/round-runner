import { URL_PARAM } from '$lib/enum';

export function match(param: string) {
	return param === URL_PARAM.ROUTE_INFORMATION;
}