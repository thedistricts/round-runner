
import { DOMAIN } from '$env/static/private';
import manifast from '$lib/data/round-manifest.json';
export const prerender = true;

function getRoundPages() {
	const rounds = manifast.rounds.map((round) => `
		<url>
			<loc>${DOMAIN}/${round.slug}</loc>
			<changefreq>monthly</changefreq>
		</url>
		<url>
			<loc>${DOMAIN}/${round.slug}/route-information</loc>
			<changefreq>monthly</changefreq>
		</url>
	`);
	return rounds.join("");
}

export async function GET() {
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			${getRoundPages()}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml',
			},
		},
	);
}