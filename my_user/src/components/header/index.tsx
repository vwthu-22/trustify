"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Menu, X, Building2, ArrowRight, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';
import useCompanyStore from '@/stores/companyStore/company';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('header');
    const tSearch = useTranslations('search');

    const { user, isAuthenticated, logout, fetchUserInfo } = useAuthStore();
    const { searchResults, isSearching, searchCompanies, clearSearchResults } = useCompanyStore();
    const { theme, toggleTheme, mounted } = useTheme();

    // Verify session with backend on mount
    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    // Fetch notifications when user is authenticated
    // DISABLED: Backend doesn't have /api/notification/my-notifications endpoint yet
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         fetchNotifications();
    //         const interval = setInterval(fetchNotifications, 30000);
    //         return () => clearInterval(interval);
    //     }
    // }, [isAuthenticated, fetchNotifications]);

    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (isHomePage) {
                if (window.scrollY > 300) {
                    setShowSearchBar(true);
                } else {
                    setShowSearchBar(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    useEffect(() => {
        setShowMobileMenu(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                searchCompanies(searchQuery);
                setShowSearchDropdown(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setShowSearchDropdown(false);
            clearSearchResults();
        }
    }, [searchQuery, searchCompanies, clearSearchResults]);

    const isBusinessIntro = pathname === '/intro_bus';
    const isBusinessSignup = pathname === '/intro_bus/register_bussiness';

    const getButtonConfig = () => {
        if (isBusinessSignup) return null;
        if (isBusinessIntro) return { text: t('createAccount'), href: '/intro_bus/register_bussiness' };
        return { text: t('forBusinesses'), href: '/intro_bus' };
    };

    const buttonConfig = getButtonConfig();
    const shouldShowSearchBar = isHomePage ? showSearchBar : true;

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        setShowMobileMenu(false);
        router.push('/');
    };

    const handleCompanyClick = (companyId: string) => {
        setShowSearchDropdown(false);
        setSearchQuery('');
        clearSearchResults();
        router.push(`/bussiness/${companyId}`);
    };

    return (
        <>
            <header className="bg-[#191919] text-white top-0 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
                        {/* Logo */}
                        <Link href={'/'} className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5aa5df] flex items-center justify-center rounded">
                                <span className="text-white font-bold text-sm sm:text-lg">★</span>
                            </div>
                            <span className="text-lg sm:text-xl font-semibold hidden sm:block">Trustify</span>
                        </Link>

                        {/* Search Bar - Desktop */}
                        {shouldShowSearchBar && (
                            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                                <div className="relative w-full" ref={searchDropdownRef}>
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                                        className="w-full px-4 py-2 rounded-full border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-sm bg-gray-800 text-white placeholder-gray-400"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-1.5 rounded-full transition">
                                        <Search className="w-4 h-4" />
                                    </button>

                                    {/* Search Results Dropdown */}
                                    {showSearchDropdown && searchQuery.length >= 2 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                                            {isSearching ? (
                                                <div className="py-8 text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                    <p className="text-gray-600 text-sm">{tSearch('searching')}</p>
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <div className="p-2">
                                                    {searchResults.slice(0, 8).map((company) => (
                                                        <button
                                                            key={company.id}
                                                            onClick={() => handleCompanyClick(company.id)}
                                                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition text-left group"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                                                                {company.logo ? (
                                                                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-sm font-bold text-white">{company.name.charAt(0).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate text-sm">
                                                                    {company.name}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {company.industry || company.website}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex-shrink-0" />
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-8 text-center">
                                                    <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-600 text-sm">{tSearch('noResults')} "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
                            <Link href="/write-review" className="flex items-center gap-1 hover:text-gray-300 transition text-sm">
                                {t('writeReview')}
                            </Link>
                            {isAuthenticated && user && (
                                <button
                                    onClick={toggleTheme}
                                    className="relative p-2 hover:bg-gray-700 rounded-full transition-all duration-300"
                                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                >
                                    {mounted && (
                                        theme === 'light' ? (
                                            <Moon className="w-5 h-5 text-gray-300 hover:text-yellow-400 transition-colors" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
                                        )
                                    )}
                                </button>
                            )}
                            {/* Language Switcher */}
                            <LanguageSwitcher />
                            {isAuthenticated && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowUserMenu(!showUserMenu); }}
                                        className="flex items-center gap-2 hover:text-gray-300 transition"
                                    >
                                        <div className="w-8 h-8 bg-[#6b5b4f] rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-sm hidden xl:block">{user.name}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showUserMenu && (
                                        <div className="absolute right-0 top-10 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                                            <Link href="/my_review" className="block px-4 py-2 text-sm hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>{t('myReviews')}</Link>
                                            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>{t('profile')}</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600">{t('logout')}</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={"/login"} className="text-sm hover:text-gray-300 transition">{t('login')}</Link>
                            )}

                            {buttonConfig && (
                                <button onClick={() => router.push(buttonConfig.href)} className="bg-[#5e5eff] hover:bg-[#4d4dff] text-white px-4 xl:px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap">
                                    {buttonConfig.text}
                                </button>
                            )}

                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 lg:hidden">
                            {isAuthenticated && user && (
                                <button
                                    onClick={toggleTheme}
                                    className="relative p-2 hover:bg-gray-700 rounded-full transition-all duration-300"
                                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                >
                                    {mounted && (
                                        theme === 'light' ? (
                                            <Moon className="w-5 h-5 text-gray-300 hover:text-yellow-400 transition-colors" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
                                        )
                                    )}
                                </button>
                            )}
                            {isAuthenticated && user && (
                                <div className="w-8 h-8 bg-[#6b5b4f] rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            )}
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-700 rounded transition">
                                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Notification Dropdown */}
                {/* {showNotifications && (
                    <div className="lg:hidden bg-white text-gray-900 border-t border-gray-200 max-h-80 overflow-y-auto notification-dropdown">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold">Notifications</h3>
                            {unreadCount > 0 && <button onClick={() => markAllAsRead()} className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>}
                        </div>
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button key={notification.id} onClick={() => handleNotificationClick(notification)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                                        </div>
                                        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )} */}

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden bg-[#191919] border-t border-gray-700">
                        <div className="px-4 py-4 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                                    className="w-full px-4 py-3 rounded-full border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-sm bg-gray-800 text-white placeholder-gray-400"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-2 rounded-full transition">
                                    <Search className="w-4 h-4" />
                                </button>

                                {/* Mobile Search Results Dropdown */}
                                {showSearchDropdown && searchQuery.length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                                        {isSearching ? (
                                            <div className="py-6 text-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-gray-600 text-sm">{tSearch('searching')}</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="p-2">
                                                {searchResults.slice(0, 6).map((company) => (
                                                    <button
                                                        key={company.id}
                                                        onClick={() => {
                                                            handleCompanyClick(company.id);
                                                            setShowMobileMenu(false);
                                                        }}
                                                        className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition text-left group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                                                            {company.logo ? (
                                                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs font-bold text-white">{company.name.charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate text-xs">
                                                                {company.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {company.industry || company.website}
                                                            </p>
                                                        </div>
                                                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex-shrink-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center">
                                                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-gray-600 text-sm">{tSearch('noResults')} "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Link href="/write-review" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">{t('writeReview')}</Link>
                                <Link href="/categories" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">{t('categories')}</Link>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                {isAuthenticated && user ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-10 h-10 bg-[#6b5b4f] rounded-full flex items-center justify-center font-semibold overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <Link href="/my_review" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">{t('myReviews')}</Link>
                                        <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">{t('profile')}</Link>
                                        <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-400 hover:bg-gray-800 rounded-lg transition">{t('logout')}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link href="/login" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">{t('login')}</Link>
                                    </div>
                                )}
                            </div>

                            {/* Language Switcher for Mobile */}
                            <div className="border-t border-gray-700 pt-4">
                                <LanguageSwitcher />
                            </div>

                            {buttonConfig && (
                                <button onClick={() => { setShowMobileMenu(false); router.push(buttonConfig.href); }} className="w-full bg-[#5e5eff] hover:bg-[#4d4dff] text-white py-3 rounded-full font-medium transition">
                                    {buttonConfig.text}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>
            <div className="h-14 sm:h-16"></div>
        </>
    );
}