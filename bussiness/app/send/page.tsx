'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Link as LinkIcon, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useInvitationStore } from '@/store/useInvitationStore';

interface InviteFormData {
    to: string;
    productLink: string;
    subject: string;
    body: string;
}

export default function SendInvitationsPage() {
    const t = useTranslations('invitations');
    const { company } = useCompanyStore();
    const { sendSingleInvite } = useInvitationStore();
    const [formData, setFormData] = useState<InviteFormData>({
        to: '',
        productLink: '',
        subject: '',
        body: ''
    });
    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Generate default product link based on company
    const getDefaultProductLink = () => {
        if (company?.id) {
            return `${window.location.origin}/bussiness/${company.id}`;
        }
        return '';
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendSingle = async () => {
        // Validation
        if (!formData.to || !validateEmail(formData.to)) {
            setErrorMessage(t('errorInvalidEmail') || 'Please enter a valid email address');
            setSendStatus('error');
            return;
        }

        if (!formData.productLink) {
            setErrorMessage(t('errorProductLinkRequired') || 'Product link is required');
            setSendStatus('error');
            return;
        }

        setSendStatus('sending');
        setErrorMessage('');

        try {
            const result = await sendSingleInvite({
                to: formData.to,
                productLink: formData.productLink,
                subject: formData.subject || undefined,
                body: formData.body || undefined
            });

            setSendStatus('success');
            setSuccessMessage(`${t('invitationSent')} (${result.to})`);

            // Reset form after success
            setTimeout(() => {
                setSendStatus('idle');
                setFormData({
                    to: '',
                    productLink: getDefaultProductLink(),
                    subject: '',
                    body: ''
                });
            }, 3000);

        } catch (error) {
            setSendStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to send invitation');
        }
    };

    // Set default product link when company loads
    useState(() => {
        if (company?.id && !formData.productLink) {
            setFormData(prev => ({ ...prev, productLink: getDefaultProductLink() }));
        }
    });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{t('title')}</h2>
                        <p className="text-white/80 text-sm">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        {t('customerInfo')}
                    </h3>

                    <div className="space-y-5">
                        {/* Email - Required */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('customerEmail')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="customer@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Product Link - Required */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product/Review Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://example.com/product/123"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.productLink}
                                    onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Link where customers can leave reviews
                            </p>
                        </div>

                        {/* Subject - Optional */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('subject')} <span className="text-gray-400 text-xs font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Please review this product"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        {/* Body - Optional */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('message')} <span className="text-gray-400 text-xs font-normal">(optional)</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Add a personalized message to your customer..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The review link will be automatically appended to your message
                            </p>
                        </div>

                        {/* Status Messages */}
                        {sendStatus === 'error' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{errorMessage}</span>
                            </div>
                        )}

                        {sendStatus === 'success' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{successMessage}</span>
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSendSingle}
                            disabled={!formData.to || !formData.productLink || sendStatus === 'sending'}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            <Send className="h-5 w-5" />
                            {sendStatus === 'sending' ? t('sending') : t('sendInvitation')}
                        </button>
                    </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {t('emailPreview')}
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">To</p>
                            <p className="text-gray-900">{formData.to || 'customer@example.com'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t('subject')}</p>
                            <p className="text-gray-900">{formData.subject || 'Please review this product'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t('message')}</p>
                            <div className="text-gray-900 whitespace-pre-line text-sm">
                                {formData.body || 'Thank you for your purchase!'}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-600">Click to leave a review:</p>
                                    <a href={formData.productLink || '#'} className="text-blue-600 break-all">
                                        {formData.productLink || 'https://example.com/review'}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-600 text-white rounded-lg text-center cursor-pointer hover:bg-blue-700 transition-colors">
                            <button className="font-semibold">{t('leaveReview')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}