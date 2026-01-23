'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Link as LinkIcon, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useInvitationStore } from '@/store/useInvitationStore';

interface InviteFormData {
    to: string;
    name: string;
    productLink: string;
    productCode: string;
    subject: string;
    body: string;
}


export default function SendInvitationsPage() {
    const t = useTranslations('invitations');
    const { company } = useCompanyStore();
    const { sendSingleInvite } = useInvitationStore();

    const [formData, setFormData] = useState<InviteFormData>({
        to: '',
        name: '',
        productLink: '',
        productCode: '',
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

        if (!formData.name) {
            setErrorMessage('Customer name is required');
            setSendStatus('error');
            return;
        }

        if (!formData.productLink) {
            setErrorMessage(t('errorProductLinkRequired') || 'Product link is required');
            setSendStatus('error');
            return;
        }

        if (!company?.id) {
            setErrorMessage('Company ID is required');
            setSendStatus('error');
            return;
        }

        setSendStatus('sending');
        setErrorMessage('');

        try {
            const result = await sendSingleInvite(Number(company.id), {
                to: formData.to,
                name: formData.name,
                productLink: formData.productLink,
                productCode: formData.productCode || undefined,
                subject: formData.subject || undefined,
                body: formData.body || undefined
            });

            setSendStatus('success');
            setSuccessMessage(`${t('invitationSent')} (${result.to})`);

            setTimeout(() => {
                setSendStatus('idle');
                setFormData({
                    to: '',
                    name: '',
                    productLink: getDefaultProductLink(),
                    productCode: '',
                    subject: '',
                    body: ''
                });
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
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('reviewLink')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://yourwebsite.com/review/product/123"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.productLink}
                                        onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Code <span className="text-gray-400 text-xs">{t('optional')}</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="SKU-123"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.productCode}
                                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('subject')} <span className="text-gray-400 text-xs">{t('optional')}</span>
                            </label>
                            <input
                                type="text"
                                placeholder={t('placeholderSubject')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('message')} <span className="text-gray-400 text-xs">{t('optional')}</span>
                            </label>
                            <textarea
                                rows={5}
                                placeholder={t('placeholderPersonalized')}
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
                            disabled={!formData.to || !formData.name || !formData.productLink || sendStatus === 'sending'}
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
                        <h3 className="text-md text-gray-900">{t('emailPreview')}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                        <div className="space-y-3">
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-24">{t('labelTo')}</span>
                                <span className="text-gray-900">{formData.to || 'customer@example.com'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-24">Name:</span>
                                <span className="text-gray-900">{formData.name || 'John Doe'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-24">{t('labelReviewLink')}</span>
                                <span className="text-gray-900 text-xs break-all">{formData.productLink || 'https://yourwebsite.com/review/product/123'}</span>
                            </div>
                            {formData.productCode && (
                                <div className="flex">
                                    <span className="text-gray-500 font-medium w-24">Product Code:</span>
                                    <span className="text-gray-900">{formData.productCode}</span>
                                </div>
                            )}
                            <div className="flex">
                                <span className="text-gray-500 font-medium w-24 uppercase text-[10px] tracking-wider">{t('subject')}:</span>
                                <span className="text-gray-900">{formData.subject || t('placeholderSubject')}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-gray-900 whitespace-pre-line mb-4">
                                {formData.body || t('placeholderBody')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}