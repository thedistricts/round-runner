import { ORIENTATION } from '$lib/enum'
import { viewport } from './viewport.store';

describe('Viewport Store', () => {
    beforeEach(() => {
        viewport.register({ innerWidth: 1600, innerHeight: 1200 });
    });

    it('should have initial values', async () => {
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(1600);
            expect(value.innerHeight).toBe(1200);
            expect(value.ratio).toBe(4/3);
            expect(value.orientation).toBe(ORIENTATION.LANDSCAPE);
            expect(value.wide).toBe(false);
            expect(value.isMobile).toBe(false);
        });
        unsubscribe();
    });

    it('should update values correctly', async () => {
        viewport.register({ innerWidth: 400, innerHeight: 800 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(400);
            expect(value.innerHeight).toBe(800);
            expect(value.ratio).toBe(1/2);
            expect(value.orientation).toBe(ORIENTATION.PORTRAIT);
            expect(value.wide).toBe(false);
            expect(value.isMobile).toBe(true);
        })
      unsubscribe();
    });
});