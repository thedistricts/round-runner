import { describe, it, expect } from 'vitest';
import { cleanUrlForDisplay } from './string.utils';

describe('string utils', () => {
    describe('cleanUrlForDisplay', () => {
        it('should remove http protocol', () => {
            expect(cleanUrlForDisplay('http://example.com')).toBe('example.com');
        });

        it('should remove https protocol', () => {
            expect(cleanUrlForDisplay('https://example.com')).toBe('example.com');
        });

        it('should remove trailing slash', () => {
            expect(cleanUrlForDisplay('example.com/')).toBe('example.com');
        });

        it('should handle URLs with paths', () => {
            expect(cleanUrlForDisplay('https://example.com/path')).toBe('example.com/path');
        });

        it('should handle URLs with multiple slashes', () => {
            expect(cleanUrlForDisplay('https://example.com/path/')).toBe('example.com/path');
        });

        it('should handle subdomains', () => {
            expect(cleanUrlForDisplay('https://sub.example.com')).toBe('sub.example.com');
        });

        it('should handle empty string', () => {
            expect(cleanUrlForDisplay('')).toBe('');
        });

        it('should handle undefined', () => {
            expect(cleanUrlForDisplay(undefined as unknown as string)).toBe('');
        });

        it('should handle URLs without protocol', () => {
            expect(cleanUrlForDisplay('example.com')).toBe('example.com');
        });
    });
}); 