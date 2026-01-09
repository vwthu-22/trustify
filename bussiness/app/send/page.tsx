'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Link as LinkIcon, Eye } from 'lucide-react';
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
    const [showPreview, setShowPreview] = useState(false);

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

            setTimeout(() => {
                setSendStatus('idle');
                setFormData({ to: '', productLink: getDefaultProductLink(), subject: '', body: '' });
            }, 3000);

        } catch (error) {
            setSendStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to send invitation');
        }
    };

    useState(() => {
        if (company?.id && !formData.productLink) {
            setFormData(prev => ({ ...prev, productLink: getDefaultProductLink() }));
        }
    });

    return (
        <div className="max-w-2xl mx-auto">
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] rounded-lg p-4 text-white mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{t('title')}</h2>
                        <p className="text-white/70 text-xs">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="space-y-4">
                    {/* Email & Product Link - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                {t('customerEmail')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="customer@example.com"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Review Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://example.com/product"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.productLink}
                                    onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            {t('subject')} <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Please review this product"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            {t('message')} <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add a personalized message..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        />
                    </div>

                    {/* Status Messages */}
                    {sendStatus === 'error' && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {sendStatus === 'success' && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">{successMessage}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            {showPreview ? 'Hide' : 'Preview'}
                        </button>
                        <button
                            onClick={handleSendSingle}
                            disabled={!formData.to || !formData.productLink || sendStatus === 'sending'}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                            {sendStatus === 'sending' ? t('sending') : t('sendInvitation')}
                        </button>
                    </div>
                </div>

                {/* Collapsible Preview */}
                {showPreview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t('emailPreview')}</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                            <div className="flex">
                                <span className="text-gray-500 w-16">To:</span>
                                <span className="text-gray-900">{formData.to || 'customer@example.com'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-16">Subject:</span>
                                <span className="text-gray-900">{formData.subject || 'Please review this product'}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-gray-900 whitespace-pre-line">{formData.body || 'Thank you for your purchase!'}</p>
                                <div className="mt-3 p-3 bg-blue-600 text-white rounded-lg text-center text-sm font-medium">
                                    {t('leaveReview')} →
                                </div>
                                <p className="mt-2 text-xs text-gray-500 break-all">{formData.productLink || 'https://example.com/review'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}