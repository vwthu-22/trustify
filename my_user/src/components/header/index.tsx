"use client"
import React, { useState, useEffect } from 'react';
import { Search, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            // Khi scroll xuống hơn 300px thì hiện search bar trên header
            if (window.scrollY > 300) {
                setShowSearchBar(true);
            } else {
                setShowSearchBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                    {/* Search Bar - Hiện khi scroll */}
                    <div className={`hidden md:flex flex-1 max-w-md mx-4 transition-opacity duration-300 ${
                        showSearchBar ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                        <Link href={"/login"} className="text-sm hover:text-gray-300 transition">Log in</Link>
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

