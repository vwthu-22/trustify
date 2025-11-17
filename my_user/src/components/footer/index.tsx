"use client"
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const sections = [
        {
            title: 'Về',
            links: ['Về chúng tôi', 'Jobs', 'Sự tiếp xúc', 'Bài viết', 'Cách hoạt động của Trustify', 'Báo cáo tin cậy', 'Báo chí', 'Quan hệ nhà đầu tư']
        },
        {
            title: 'Cộng đồng',
            links: ['Tin tưởng vào các bài đánh giá', 'Trung tâm trợ giúp', 'Đăng nhập', 'Đăng ký']
        },
        {
            title: 'Doanh nghiệp',
            links: ['Kinh doanh Trustify', 'Sản phẩm', 'Kế hoạch & Giá cả', 'Đăng nhập doanh nghiệp', 'Blog dành cho doanh nghiệp']
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Logo */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 bg-[#5aa5df] flex items-center justify-center rounded">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">Trustify</span>
                        </div>
                    </div>

                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-gray-300 hover:text-white text-sm transition">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h3 className="font-semibold mb-4">Theo dõi chúng tôi trên</h3>
                        <div className="flex gap-3 mb-8">
                            {socials.map(({ Icon, href }, i) => (
                                <Link key={i} href={href} className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>

                        <h3 className="font-semibold mb-4">Chọn quốc gia</h3>
                        <select className="w-full bg-white text-gray-900 px-4 py-2 rounded border-0 focus:ring-2 focus:ring-blue-500">
                            <option>[🇺🇸] Hoa Kỳ</option>
                            <option>[🇻🇳] Việt Nam</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
};
