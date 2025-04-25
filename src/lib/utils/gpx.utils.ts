import type { RouteGeoJson } from '$lib/stores/route.store.d';

export function convertToGPX(route: RouteGeoJson, roundName: string, roundInfo?: string): string {
    const header = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<gpx version="1.1" creator="Round Runner"',
        '  xmlns="http://www.topografix.com/GPX/1/1"',
        '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">',
        '  <metadata>',
        `    <name>${roundName}</name>`,
        roundInfo ? `    <desc>${roundInfo}</desc>` : '',
        `    <time>${new Date().toISOString()}</time>`,
        '  </metadata>'
    ].filter(Boolean).join('\n');

    const waypoints = route.features.map(feature => {
        const [lon, lat] = feature.geometry.coordinates;
        return [
            `  <wpt lat="${lat}" lon="${lon}">`,
            `    <name>${feature.properties.name}</name>`,
            feature.properties.notes ? `    <desc>${feature.properties.notes}</desc>` : '',
            '  </wpt>'
        ].filter(Boolean).join('\n');
    }).join('\n');

    const footer = '</gpx>';

    return [header, waypoints, footer].join('\n');
} 