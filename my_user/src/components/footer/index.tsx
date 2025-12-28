"use client"
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    const sections = [
        {
            title: t('about'),
            links: [t('aboutUs'), t('jobs'), t('contact'), t('blog'), t('howItWorks'), t('trustReport'), t('press'), t('investors')]
        },
        {
            title: t('community'),
            links: [t('trustReviews'), t('helpCenter'), t('login'), t('register')]
        },
        {
            title: t('businesses'),
            links: [t('trustifyBusiness'), t('products'), t('pricing'), t('businessLogin'), t('businessBlog')]
        }
    ];

    const socials = [
        { Icon: Facebook, href: '#' },
        { Icon: Twitter, href: '#' },
        { Icon: Instagram, href: '#' },
        { Icon: Linkedin, href: '#' },
        { Icon: Youtube, href: '#' }
    ];

    return (
        <footer className="bg-[#1a1a1a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
                    {/* Logo - Full width on mobile */}
                    <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6 sm:mb-8">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5aa5df] flex items-center justify-center rounded">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <span className="text-lg sm:text-xl font-bold">Trustify</span>
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="col-span-1">
                            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-gray-300 hover:text-white text-xs sm:text-sm transition">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Social & Country - Takes full width on small screens */}
                    <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
                        <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('followUs')}</h3>
                        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {socials.map(({ Icon, href }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition"
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
                    <p className="text-gray-400 text-xs sm:text-sm text-center">
                        © {new Date().getFullYear()} Trustify. {t('allRights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
