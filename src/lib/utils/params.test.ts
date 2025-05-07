import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUrlWithParams, getUrlParamsWithNew } from './params';

describe('params', () => {
	beforeEach(() => {
		// Reset window.location mock before each test
		vi.stubGlobal('window', {
			location: {
				pathname: '/test',
				search: ''
			}
		});
		vi.stubGlobal('browser', true);

		// Mock URLSearchParams
		global.URLSearchParams = vi.fn().mockImplementation(function(init?: string) {
			const params = new Map<string, string[]>();

			if (init) {
				const searchParams = init.replace('?', '').split('&');
				searchParams.forEach(param => {
					const [key, value] = param.split('=');
					if (key) {
						if (!params.has(key)) {
							params.set(key, []);
						}
						params.get(key)?.push(value || '');
					}
				});
			}

			return {
				append(key: string, value: string) {
					if (!params.has(key)) {
						params.set(key, []);
					}
					params.get(key)?.push(value);
				},
				delete(key: string) {
					params.delete(key);
				},
				get(key: string) {
					return params.get(key)?.[0] || null;
				},
				getAll(key: string) {
					return params.get(key) || [];
				},
				has(key: string) {
					return params.has(key);
				},
				set(key: string, value: string) {
					params.set(key, [value]);
				},
				sort() {
					// Not implemented for tests
				},
				toString() {
					const entries: string[] = [];
					params.forEach((values, key) => {
						values.forEach(value => {
							entries.push(`${key}=${value}`);
						});
					});
					return entries.join('&');
				},
				forEach(callback: (value: string, key: string) => void) {
					params.forEach((values, key) => {
						values.forEach(value => callback(value, key));
					});
				},
				entries() {
					const entries: [string, string][] = [];
					params.forEach((values, key) => {
						values.forEach(value => entries.push([key, value]));
					});
					return entries[Symbol.iterator]();
				},
				keys() {
					return Array.from(params.keys())[Symbol.iterator]();
				},
				values() {
					const values: string[] = [];
					params.forEach(paramValues => values.push(...paramValues));
					return values[Symbol.iterator]();
				},
				get size() {
					return params.size;
				}
			};
		});
	});

	describe('getUrlWithParams', () => {
		it('should return pathname when isActive is false', () => {
			const result = getUrlWithParams({ when: false, with: 'test' });
			expect(result).toBe('/test');
		});

		it('should return pathname with param when isActive is true', () => {
			const result = getUrlWithParams({ when: true, with: 'test' });
			expect(result).toBe('/test?test=true');
		});

		it('should handle existing query params', () => {
			vi.stubGlobal('window', {
				location: {
					pathname: '/test',
					search: '?existing=value'
				}
			});

			const result = getUrlWithParams({ when: true, with: 'test' });
			expect(result).toBe('/test?test=true');
		});
	});

	describe('getUrlParamsWithNew', () => {
		it('should return location without params when no params exist', () => {
			const [url, hasParams] = getUrlParamsWithNew({ location: '/new' });
			expect(url).toBe('/new');
			expect(hasParams).toBe(false);
		});

		it('should return location with existing params', () => {
			vi.stubGlobal('window', {
				location: {
					pathname: '/test',
					search: '?test=true'
				}
			});

			const [url, hasParams] = getUrlParamsWithNew({ location: '/new' });
			expect(url).toBe('/new?test=true');
			expect(hasParams).toBe(true);
		});

		it('should handle empty location', () => {
			vi.stubGlobal('window', {
				location: {
					pathname: '/test',
					search: '?test=true'
				}
			});

			const [url, hasParams] = getUrlParamsWithNew({ location: '' });
			expect(url).toBe('?test=true');
			expect(hasParams).toBe(true);
		});
	});
}); 