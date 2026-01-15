import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://trustify-pied.vercel.app';

    const routes = [
        '',
        '/categories',
        '/write-review',
        '/login',
        '/about',
        '/intro_bus',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));
}
