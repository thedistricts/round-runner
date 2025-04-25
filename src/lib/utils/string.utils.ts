/**
 * Cleans a URL for display by removing protocol and trailing slashes
 * @example
 * cleanUrlForDisplay('https://example.com/') // returns 'example.com'
 * cleanUrlForDisplay('http://sub.example.com/path/') // returns 'sub.example.com/path'
 */
export function cleanUrlForDisplay(url: string): string {
    if (!url) return '';
    return url.replace(/^(https?:)?\/\//, '').replace(/\/$/, '');
} 