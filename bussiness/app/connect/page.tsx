'use client';

import { useState } from 'react';
import { Globe, Code, CheckCircle, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ConnectPage() {
    const t = useTranslations('connect');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'meta' | 'file' | 'dns'>('meta');
    const [isVerified, setIsVerified] = useState(false);
    const [copied, setCopied] = useState(false);

    const verificationCode = `<meta name="trustify-verification" content="abc123xyz789" />`;
    const verificationFile = `trustify-verification.txt`;
    const dnsRecord = `TXT @ trustify-verification=abc123xyz789`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = () => {
        // Simulate verification
        setTimeout(() => {
            setIsVerified(true);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Website URL Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('websiteInfo')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('websiteUrl')} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('verificationMethod')}</h3>

                {/* Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => setVerificationMethod('meta')}
                        className={`p-4 border-2 rounded-lg transition-all ${verificationMethod === 'meta'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Code className="h-6 w-6 mb-2 text-blue-600" />
                        <p className="font-medium text-gray-900">{t('htmlMetaTag')}</p>
                        <p className="text-xs text-gray-600 mt-1">{t('addTagToWebsite')}</p>
                    </button>

                    <button
                        onClick={() => setVerificationMethod('file')}
                        className={`p-4 border-2 rounded-lg transition-all ${verificationMethod === 'file'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Globe className="h-6 w-6 mb-2 text-blue-600" />
                        <p className="font-medium text-gray-900">{t('htmlFileUpload')}</p>
                        <p className="text-xs text-gray-600 mt-1">{t('uploadFileToRoot')}</p>
                    </button>

                    <button
                        onClick={() => setVerificationMethod('dns')}
                        className={`p-4 border-2 rounded-lg transition-all ${verificationMethod === 'dns'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlertCircle className="h-6 w-6 mb-2 text-blue-600" />
                        <p className="font-medium text-gray-900">{t('dnsRecord')}</p>
                        <p className="text-xs text-gray-600 mt-1">{t('addTxtRecord')}</p>
                    </button>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                    {verificationMethod === 'meta' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-3">
                                {t('step1CopyMeta')}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <code className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded text-sm overflow-x-auto">
                                    {verificationCode}
                                </code>
                                <button
                                    onClick={() => handleCopy(verificationCode)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? t('copied') : t('copy')}
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Step 2: Add this tag to the &lt;head&gt; section of your website's homepage
                            </p>
                            <p className="text-sm text-gray-700">
                                Step 3: Click "Verify" button below
                            </p>
                        </div>
                    )}

                    {verificationMethod === 'file' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-3">
                                Step 1: Download verification file
                            </p>
                            <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Download {verificationFile}
                            </button>
                            <p className="text-sm text-gray-700 mb-2">
                                Step 2: Upload this file to your website's root directory
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                The file should be accessible at: {websiteUrl || 'https://yourwebsite.com'}/{verificationFile}
                            </p>
                            <p className="text-sm text-gray-700">
                                Step 3: Click "Verify" button below
                            </p>
                        </div>
                    )}

                    {verificationMethod === 'dns' && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-3">
                                Step 1: Copy this DNS record
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <code className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded text-sm overflow-x-auto">
                                    {dnsRecord}
                                </code>
                                <button
                                    onClick={() => handleCopy(dnsRecord)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Step 2: Add this TXT record to your domain's DNS settings
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Note: DNS changes may take up to 48 hours to propagate
                            </p>
                            <p className="text-sm text-gray-700">
                                Step 3: Click "Verify" button below
                            </p>
                        </div>
                    )}
                </div>

                {/* Verify Button */}
                <div className="mt-6">
                    {isVerified ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">{t('websiteVerified')}</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleVerify}
                            disabled={!websiteUrl}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('verifyWebsite')}
                        </button>
                    )}
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('afterVerification')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Collect Reviews</p>
                            <p className="text-sm text-gray-600">Start receiving customer reviews</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Display Widgets</p>
                            <p className="text-sm text-gray-600">Embed review widgets on your site</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Build Trust</p>
                            <p className="text-sm text-gray-600">Increase customer confidence</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">SEO Benefits</p>
                            <p className="text-sm text-gray-600">Improve search rankings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
