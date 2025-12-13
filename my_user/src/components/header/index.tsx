"use client"
import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, X, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';
import useNotificationStore from '@/stores/notificationStore/notification';

export default function Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { user, isAuthenticated, logout, fetchUserInfo } = useAuthStore();
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

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
        setShowNotifications(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.notification-dropdown')) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const isBusinessIntro = pathname === '/intro_bus';
    const isBusinessSignup = pathname === '/intro_bus/register_bussiness';

    const getButtonConfig = () => {
        if (isBusinessSignup) return null;
        if (isBusinessIntro) return { text: 'Create account', href: '/intro_bus/register_bussiness' };
        return { text: 'For businesses', href: '/intro_bus' };
    };

    const buttonConfig = getButtonConfig();
    const shouldShowSearchBar = isHomePage ? showSearchBar : true;

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        setShowMobileMenu(false);
        router.push('/');
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        setShowNotifications(false);
        if (notification.companyId && notification.reviewId) {
            router.push(`/bussiness/${notification.companyId}#review-${notification.reviewId}`);
        } else if (notification.companyId) {
            router.push(`/bussiness/${notification.companyId}`);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
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
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Search company or category"
                                        className="w-full px-4 py-2 rounded-full border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-sm bg-gray-800 text-white placeholder-gray-400"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-1.5 rounded-full transition">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
                            <Link href="/write-review" className="flex items-center gap-1 hover:text-gray-300 transition text-sm">
                                Write a review
                            </Link>
                            <Link href="/categories" className="hover:text-gray-300 transition text-sm">
                                Categories
                            </Link>

                            {isAuthenticated && user && (
                                <div className="relative notification-dropdown">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowNotifications(!showNotifications);
                                            setShowUserMenu(false);
                                        }}
                                        className="relative p-2 hover:bg-gray-700 rounded-full transition"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 top-12 w-80 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                                                <h3 className="font-semibold">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <button onClick={() => markAllAsRead()} className="text-sm text-blue-600 hover:text-blue-800">
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-center text-gray-500">
                                                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                        <p>No notifications yet</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <button
                                                            key={notification.id}
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                                        >
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
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAuthenticated && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                                        className="flex items-center gap-2 hover:text-gray-300 transition"
                                    >
                                        <div className="w-8 h-8 bg-[#6b5b4f] rounded-full flex items-center justify-center text-sm font-semibold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm hidden xl:block">{user.name}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showUserMenu && (
                                        <div className="absolute right-0 top-10 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                                            <Link href="/my_review" className="block px-4 py-2 text-sm hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>My Reviews</Link>
                                            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>Profile</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={"/login"} className="text-sm hover:text-gray-300 transition">Log in</Link>
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
                                <button onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }} className="relative p-2 hover:bg-gray-700 rounded-full transition">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                                </button>
                            )}
                            {isAuthenticated && user && (
                                <div className="w-8 h-8 bg-[#6b5b4f] rounded-full flex items-center justify-center text-sm font-semibold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-700 rounded transition">
                                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Notification Dropdown */}
                {showNotifications && (
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
                )}

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden bg-[#191919] border-t border-gray-700">
                        <div className="px-4 py-4 space-y-4">
                            <div className="relative">
                                <input type="text" placeholder="Search company or category" className="w-full px-4 py-3 rounded-full border-2 border-gray-600 focus:border-blue-500 focus:outline-none text-sm bg-gray-800 text-white placeholder-gray-400" />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-2 rounded-full transition">
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <Link href="/write-review" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">Write a review</Link>
                                <Link href="/categories" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">Categories</Link>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                {isAuthenticated && user ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-10 h-10 bg-[#6b5b4f] rounded-full flex items-center justify-center font-semibold">{user.name?.charAt(0).toUpperCase()}</div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <Link href="/my_review" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">My Reviews</Link>
                                        <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">Profile</Link>
                                        <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-400 hover:bg-gray-800 rounded-lg transition">Logout</button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link href="/login" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-gray-300 hover:bg-gray-800 rounded-lg transition">Log in</Link>
                                    </div>
                                )}
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