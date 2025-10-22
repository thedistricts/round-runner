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
            expect(value.isTablet).toBe(false);
            expect(value.isDesktop).toBe(true);
        });
        unsubscribe();
    });

    it('should update values correctly for mobile', async () => {
        viewport.register({ innerWidth: 400, innerHeight: 800 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(400);
            expect(value.innerHeight).toBe(800);
            expect(value.ratio).toBe(1/2);
            expect(value.orientation).toBe(ORIENTATION.PORTRAIT);
            expect(value.wide).toBe(false);
            expect(value.isMobile).toBe(true);
            expect(value.isTablet).toBe(false);
            expect(value.isDesktop).toBe(false);
        })
        unsubscribe();
    });

    it('should detect tablet correctly', async () => {
        viewport.register({ innerWidth: 1024, innerHeight: 768 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(1024);
            expect(value.innerHeight).toBe(768);
            expect(value.ratio).toBe(4/3);
            expect(value.orientation).toBe(ORIENTATION.LANDSCAPE);
            expect(value.wide).toBe(false);
            expect(value.isMobile).toBe(false);
            expect(value.isTablet).toBe(true);
            expect(value.isDesktop).toBe(false);
        });
        unsubscribe();
    });

    it('should detect desktop correctly', async () => {
        viewport.register({ innerWidth: 1920, innerHeight: 1080 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(1920);
            expect(value.innerHeight).toBe(1080);
            expect(value.ratio).toBe(16/9);
            expect(value.orientation).toBe(ORIENTATION.LANDSCAPE);
            expect(value.wide).toBe(false);
            expect(value.isMobile).toBe(false);
            expect(value.isTablet).toBe(false);
            expect(value.isDesktop).toBe(true);
        });
        unsubscribe();
    });

    it('should detect wide screens correctly', async () => {
        viewport.register({ innerWidth: 2560, innerHeight: 1080 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(2560);
            expect(value.innerHeight).toBe(1080);
            expect(value.ratio).toBe(2560/1080);
            expect(value.orientation).toBe(ORIENTATION.LANDSCAPE);
            expect(value.wide).toBe(true);
            expect(value.isMobile).toBe(false);
            expect(value.isTablet).toBe(false);
            expect(value.isDesktop).toBe(true);
        });
        unsubscribe();
    });

    it('should detect portrait wide screens correctly', async () => {
        viewport.register({ innerWidth: 600, innerHeight: 1200 });
        const unsubscribe = await viewport.subscribe((value) => {
            expect(value.innerWidth).toBe(600);
            expect(value.innerHeight).toBe(1200);
            expect(value.ratio).toBe(1/2);
            expect(value.orientation).toBe(ORIENTATION.PORTRAIT);
            expect(value.wide).toBe(false); // 1/2 = 0.5, which is not < 0.5, so wide should be false
            expect(value.isMobile).toBe(true); // 600px is <= 640px, so it should be mobile
            expect(value.isTablet).toBe(false);
            expect(value.isDesktop).toBe(false);
        });
        unsubscribe();
    });
});