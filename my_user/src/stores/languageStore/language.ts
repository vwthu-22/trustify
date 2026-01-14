import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Locale = 'vi' | 'en' | 'ru' | 'ja' | 'zh' | 'pt';

interface LanguageStore {
    locale: Locale;
    isHydrated: boolean;
    setLocale: (locale: Locale) => void;
    setHydrated: () => void;
}

const useLanguageStore = create<LanguageStore>()(
    devtools(
        persist(
            (set) => ({
                locale: 'vi',
                isHydrated: false,

                setLocale: (locale: Locale) => {
                    // Set cookie for server-side
                    if (typeof window !== 'undefined') {
                        document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
                        set({ locale });
                        // Reload to apply new locale
                        window.location.reload();
                    }
                },

                setHydrated: () => set({ isHydrated: true }),
            }),
            {
                name: 'language-storage',
                onRehydrateStorage: () => (state) => {
                    state?.setHydrated();
                },
            }
        ),
        { name: 'language-store' }
    )
);

export default useLanguageStore;
