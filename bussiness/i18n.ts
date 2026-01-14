import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'vi', 'ru', 'ja', 'zh', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async () => {
    let locale: Locale = defaultLocale;

    try {
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get('locale');
        if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
            locale = localeCookie.value as Locale;
        }
    } catch {
        // If cookies() fails (e.g., during static generation), use default
        locale = defaultLocale;
    }

    let messages;
    try {
        messages = (await import(`./messages/${locale}.json`)).default;
    } catch {
        // Fallback to default locale if message file not found
        messages = (await import(`./messages/${defaultLocale}.json`)).default;
    }

    return {
        locale,
        messages,
    };
});
