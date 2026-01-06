'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
    const router = useRouter();
    const t = useTranslations('support');

    // Redirect to dashboard after a short delay
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {t('useFloatingChat') || 'Sử dụng Chat Widget'}
                </h1>

                <p className="text-gray-600 mb-6">
                    {t('floatingChatDescription') || 'Để chat với khách hàng, hãy sử dụng nút chat ở góc phải dưới màn hình. Widget này hoạt động giống như Messenger - bạn có thể chat từ bất kỳ trang nào!'}
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>{t('redirecting') || 'Đang chuyển hướng về Dashboard...'}</span>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-blue-900">
                                {t('lookForButton') || 'Tìm nút này ở góc phải dưới'}
                            </p>
                            <p className="text-sm text-blue-600">
                                {t('clickToChat') || 'Click để mở chat'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
