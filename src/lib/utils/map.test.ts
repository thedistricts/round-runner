import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fitBoundsWithPadding, fitPositionWithOffset } from './map';
import type { Map } from 'maplibre-gl';

vi.mock('maplibre-gl', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		LngLatBounds: class {
			extend() {
				return this;
			}
		}
	};
});

describe('map', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('fitBoundsWithPadding', () => {
		it('should not call fitBounds when map is not provided', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			fitBoundsWithPadding({ map: undefined, bBox: [0, 0, 1, 1] });
			expect(mockMap.fitBounds).not.toHaveBeenCalled();
		});

		it('should not call fitBounds when bBox is invalid', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			fitBoundsWithPadding({ map: mockMap, bBox: [NaN, 0, 1, 1] });
			expect(mockMap.fitBounds).not.toHaveBeenCalled();
		});

		it('should call fitBounds with correct padding for desktop', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			// Mock window dimensions
			Object.defineProperty(window, 'innerWidth', { value: 1000 });
			Object.defineProperty(window, 'innerHeight', { value: 800 });
			
			fitBoundsWithPadding({ 
				map: mockMap, 
				bBox: [0, 0, 1, 1],
				animate: false,
				delay: 0
			});
			
			vi.advanceTimersByTime(0);
			
			expect(mockMap.fitBounds).toHaveBeenCalledWith(
				[0, 0, 1, 1],
				{
					padding: {
						top: 120, // 800 * 0.15
						bottom: 120, // 800 * 0.15
						left: 320, // 1000 * 0.32
						right: 25 // 1000 * 0.025
					},
					animate: false
				}
			);
		});

		it('should call fitBounds with correct padding for mobile', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			// Mock window dimensions
			Object.defineProperty(window, 'innerWidth', { value: 1000 });
			Object.defineProperty(window, 'innerHeight', { value: 800 });
			
			fitBoundsWithPadding({ 
				map: mockMap, 
				bBox: [0, 0, 1, 1],
				animate: false,
				delay: 0,
				isMobile: true
			});
			
			vi.advanceTimersByTime(0);
			
			expect(mockMap.fitBounds).toHaveBeenCalledWith(
				[0, 0, 1, 1],
				{
					padding: {
						top: 320, // 800 * 0.4
						bottom: 80, // 800 * 0.1
						left: 150, // 1000 * 0.15
						right: 150 // 1000 * 0.15
					},
					animate: false
				}
			);
		});
	});

	describe('fitPositionWithOffset', () => {
		it('should not call fitBounds when map is not provided', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			fitPositionWithOffset({ map: undefined, position: [0, 0] });
			expect(mockMap.fitBounds).not.toHaveBeenCalled();
		});

		it('should not call fitBounds when position is not provided', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			fitPositionWithOffset({ map: mockMap, position: undefined });
			expect(mockMap.fitBounds).not.toHaveBeenCalled();
		});

		it('should call fitBounds with correct parameters for desktop', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			// Mock window dimensions
			Object.defineProperty(window, 'innerWidth', { value: 1000 });
			Object.defineProperty(window, 'innerHeight', { value: 800 });
			
			fitPositionWithOffset({ 
				map: mockMap, 
				position: [0, 0],
				animate: false,
				delay: 0
			});
			
			vi.advanceTimersByTime(0);
			
			expect(mockMap.fitBounds).toHaveBeenCalledWith(
				expect.any(Object), // LngLatBounds object
				{
					maxZoom: 13,
					padding: {
						top: 0,
						left: 320 // 1000 * 0.32
					},
					duration: 1000,
					animate: false
				}
			);
		});

		it('should call fitBounds with correct parameters for mobile', () => {
			const mockMap = {
				fitBounds: vi.fn()
			} as unknown as Map;
			
			// Mock window dimensions
			Object.defineProperty(window, 'innerWidth', { value: 1000 });
			Object.defineProperty(window, 'innerHeight', { value: 800 });
			
			fitPositionWithOffset({ 
				map: mockMap, 
				position: [0, 0],
				animate: false,
				delay: 0,
				isMobile: true
			});
			
			vi.advanceTimersByTime(0);
			
			expect(mockMap.fitBounds).toHaveBeenCalledWith(
				expect.any(Object), // LngLatBounds object
				{
					maxZoom: 13,
					padding: {
						top: 240, // 800 * 0.3
						left: 0
					},
					duration: 1000,
					animate: false
				}
			);
		});
	});
}); 