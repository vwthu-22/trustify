"use client"
import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';

export default function Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { user, isAuthenticated, logout, fetchUserInfo } = useAuthStore();

    // Verify session with backend on mount
    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

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

    const isBusinessIntro = pathname === '/intro_bus';
    const isBusinessSignup = pathname === '/intro_bus/register_bussiness';

    const getButtonConfig = () => {
        if (isBusinessSignup) {
            return null;
        }
        if (isBusinessIntro) {
            return {
                text: 'Create account',
                href: '/intro_bus/register_bussiness'
            };
        }
        return {
            text: 'For businesses',
            href: '/intro_bus'
        };
    };

    const buttonConfig = getButtonConfig();
    const shouldShowSearchBar = isHomePage ? showSearchBar : true;

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        router.push('/');
    };

    return (
        <header className="bg-[#191919] text-white top-0 fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href={'/'} className="flex items-center gap-2 mr-4">
                        <div className="w-8 h-8 bg-[#5aa5df] flex items-center justify-center rounded">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">Trustify</span>
                    </Link>

                    {/* Search Bar */}
                    <div className={`hidden md:flex flex-1 max-w-md mx-4 transition-opacity duration-300 ${shouldShowSearchBar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search company or category"
                                className="w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm bg-white text-gray-900"
                            />
                            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-2 rounded-full transition">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6 ml-4">
                        <Link href="#" className="text-sm hover:text-gray-300 transition">Write a review</Link>
                        <Link href="#" className="text-sm hover:text-gray-300 transition">Categories</Link>
                        <Link href="#" className="text-sm hover:text-gray-300 transition">Blog</Link>
                        <button className="p-2 hover:bg-gray-700 rounded transition">
                            <Bell className="w-5 h-5" />
                        </button>

                        {/* User Menu hoặc Login */}
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                    className="flex items-center gap-2 hover:text-gray-300 transition"
                                >
                                    <div className="w-8 h-8 bg-[#6b5b4f] rounded-full flex items-center justify-center text-sm font-semibold">
                                        {/* {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )} */}
                                    </div>
                                    <span className="text-sm">{user.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-900">
                                        <Link
                                            href="/my_review"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            My Reviews
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href={"/login"} className="text-sm hover:text-gray-300 transition">
                                Log in
                            </Link>
                        )}

                        {buttonConfig && (
                            <button
                                onClick={() => router.push(buttonConfig.href)}
                                className="bg-[#5e5eff] hover:bg-[#4d4dff] text-white px-6 py-2 rounded-full text-sm font-medium transition"
                            >
                                {buttonConfig.text}
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}