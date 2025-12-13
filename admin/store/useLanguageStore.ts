import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Locale = 'vi' | 'en';

interface LanguageStore {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const useLanguageStore = create<LanguageStore>()(
    devtools(
        persist(
            (set) => ({
                locale: 'vi',

                setLocale: (locale: Locale) => {
                    // Set cookie for server-side
                    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
                    set({ locale });
                    // Reload to apply new locale
                    window.location.reload();
                },
            }),
            {
                name: 'language-storage',
            }
        ),
        { name: 'language-store' }
    )
);

export default useLanguageStore;
