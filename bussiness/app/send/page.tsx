'use client';

import { useState } from 'react';
import { Mail, Upload, Send, X, CheckCircle, AlertCircle, Link as LinkIcon, FileText, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useInvitationStore } from '@/store/useInvitationStore';

interface InviteFormData {
    to: string;
    productLink: string;
    subject: string;
    body: string;
}

interface BulkInvite {
    to: string;
    productLink: string;
}

export default function SendInvitationsPage() {
    const t = useTranslations('invitations');
    const { company } = useCompanyStore();
    const { sendSingleInvite, isLoading: storeLoading, error: storeError } = useInvitationStore();
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
    const [formData, setFormData] = useState<InviteFormData>({
        to: '',
        productLink: '',
        subject: '',
        body: ''
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [bulkData, setBulkData] = useState<BulkInvite[]>([]);
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);

            // Parse CSV file
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const parsed: BulkInvite[] = [];

            // Skip header row
            for (let i = 1; i < lines.length; i++) {
                const [email, productLink] = lines[i].split(',').map(s => s.trim());
                if (email && productLink) {
                    parsed.push({ to: email, productLink });
                }
            }
            setBulkData(parsed);
        }
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

    const handleSendBulk = async () => {
        if (bulkData.length === 0) {
            setErrorMessage('No valid data to send');
            setSendStatus('error');
            return;
        }

        setSendStatus('sending');
        setErrorMessage('');
        let successCount = 0;
        let failCount = 0;

        for (const invite of bulkData) {
            try {
                await sendSingleInvite({
                    to: invite.to,
                    productLink: invite.productLink
                });
                successCount++;
            } catch {
                failCount++;
            }
        }

        if (failCount === 0) {
            setSendStatus('success');
            setSuccessMessage(`Successfully sent ${successCount} invitations!`);
        } else {
            setSendStatus('error');
            setErrorMessage(`Sent ${successCount}, failed ${failCount} invitations`);
        }

        setTimeout(() => {
            setSendStatus('idle');
            setUploadedFile(null);
            setBulkData([]);
        }, 3000);
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
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{t('title')}</h2>
                        <p className="text-white/80 text-sm">{t('subtitle')}</p>
                    </div>
                </div>
                {company && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                        <p className="text-sm text-white/80">
                            Sending as: <span className="font-semibold text-white">{company.name}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('single')}
                    className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'single'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <User className="h-4 w-4" />
                    {t('sendSingle')}
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'bulk'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Upload className="h-4 w-4" />
                    {t('bulkSend')}
                </button>
            </div>

            {/* Single Send Tab */}
            {activeTab === 'single' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-green-600" />
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
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
                                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{successMessage}</span>
                                </div>
                            )}

                            {/* Send Button */}
                            <button
                                onClick={handleSendSingle}
                                disabled={!formData.to || !formData.productLink || sendStatus === 'sending'}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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

                            <div className="p-4 bg-green-600 text-white rounded-lg text-center cursor-pointer hover:bg-green-700 transition-colors">
                                <button className="font-semibold">{t('leaveReview')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Send Tab */}
            {activeTab === 'bulk' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        {t('bulkTitle')}
                    </h3>

                    <div className="space-y-6">
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50/30">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-700 font-medium mb-2">
                                {t('uploadCSV')}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                {t('dragDrop')}
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 cursor-pointer transition-colors shadow-sm"
                            >
                                {t('chooseFile')}
                            </label>
                        </div>

                        {/* Uploaded File Info */}
                        {uploadedFile && (
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-900">{uploadedFile.name}</p>
                                        <p className="text-sm text-green-700">
                                            {bulkData.length} valid entries found
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUploadedFile(null);
                                        setBulkData([]);
                                    }}
                                    className="text-green-700 hover:text-green-900 p-1"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Preview Table */}
                        {bulkData.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">
                                        Preview ({bulkData.length} recipients)
                                    </p>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Product Link</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {bulkData.slice(0, 5).map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 text-gray-900">{item.to}</td>
                                                    <td className="px-4 py-2 text-blue-600 truncate max-w-xs">{item.productLink}</td>
                                                </tr>
                                            ))}
                                            {bulkData.length > 5 && (
                                                <tr>
                                                    <td colSpan={2} className="px-4 py-2 text-gray-500 text-center">
                                                        ... and {bulkData.length - 5} more
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* CSV Format Info */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-2">{t('requiredFormat')}</p>
                            <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                email, productLink
                            </code>
                            <div className="mt-3">
                                <p className="text-xs text-blue-700 mb-2">Example:</p>
                                <pre className="text-xs text-blue-800 bg-blue-100 p-2 rounded overflow-x-auto">
                                    {`email,productLink
john@example.com,https://example.com/product/1
jane@example.com,https://example.com/product/2`}
                                </pre>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {sendStatus === 'error' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{errorMessage}</span>
                            </div>
                        )}

                        {sendStatus === 'success' && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{successMessage}</span>
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSendBulk}
                            disabled={bulkData.length === 0 || sendStatus === 'sending'}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <Send className="h-5 w-5" />
                            {sendStatus === 'sending' ? t('sending') : `${t('sendToAll')} (${bulkData.length})`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}