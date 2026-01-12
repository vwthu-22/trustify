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
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] text-white p-3 sm:p-4 rounded-md mb-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold mb-1">{t('title')}</h1>
                            <p className="text-blue-100 text-xs sm:text-sm">{t('subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-5">
                        {/* Email & Product Link */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('customerEmail')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="customer@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Review Link <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://trustify-company.vercel.app/bussin"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.productLink}
                                        onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('subject')} <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Please review this product"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('message')} <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Add a personalized message..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            />
                        </div>

                        {/* Status Messages */}
                        {sendStatus === 'error' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {sendStatus === 'success' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium">{successMessage}</span>
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSendSingle}
                            disabled={!formData.to || !formData.productLink || sendStatus === 'sending'}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <Send className="h-5 w-5" />
                            {sendStatus === 'sending' ? t('sending') : t('sendInvitation')}
                        </button>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{t('emailPreview')}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                        <div className="space-y-3">
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-20">To:</span>
                                <span className="text-gray-900">{formData.to || 'customer@example.com'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-20">Review Link:</span>
                                <span className="text-gray-900 text-xs break-all">{formData.productLink || 'https://trustify-company.vercel.app/bussiness/1'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-20">Subject:</span>
                                <span className="text-gray-900">{formData.subject || 'Please review this product'}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-gray-900 whitespace-pre-line mb-4">
                                {formData.body || 'Thank you for your purchase!'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}