'use client';

import { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';

export default function VerificationPage() {
    const t = useTranslations('verification');
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'document'>('email');
    const [companyEmail, setCompanyEmail] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const {
        company,
        verificationStatus,
        isUploadingVerification,
        error,
        uploadVerificationDocument,
        setVerificationStatus,
        clearError
    } = useCompanyStore();

    // Set initial status from company.verified
    useEffect(() => {
        if (company?.verified) {
            setVerificationStatus('verified');
        }
    }, [company, setVerificationStatus]);

    const handleEmailVerification = () => {
        setVerificationStatus('pending');
        // Simulate sending verification email
        setTimeout(() => {
            alert('Verification email sent! Please check your inbox.');
        }, 1000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
            clearError();
        }
    };

    const handleDocumentSubmit = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one document');
            return;
        }

        // Upload each file
        let allSuccess = true;
        for (const file of uploadedFiles) {
            const success = await uploadVerificationDocument(file);
            if (!success) {
                allSuccess = false;
                break;
            }
        }

        if (allSuccess) {
            alert('Documents submitted for review. We will verify within 2-3 business days.');
            setUploadedFiles([]);
        }
    };

    return (
        <div className="space-y-8">
            {/* Status Banner */}
            {verificationStatus === 'verified' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="text-lg font-bold text-green-900">{t('verified')}</h3>
                            <p className="text-green-700">{t('verifiedDesc')}</p>
                        </div>
                    </div>
                </div>
            )}

            {verificationStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div>
                            <h3 className="text-lg font-bold text-yellow-900">{t('pending')}</h3>
                            <p className="text-yellow-700">{t('pendingDesc')}</p>
                        </div>
                    </div>
                </div>
            )}

            {verificationStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                        <div>
                            <h3 className="text-lg font-bold text-red-900">{t('rejected')}</h3>
                            <p className="text-red-700">{t('rejectedDesc')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('whyVerify')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">{t('buildTrust')}</p>
                            <p className="text-sm text-gray-600">{t('buildTrustDesc')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">{t('verifiedBadge')}</p>
                            <p className="text-sm text-gray-600">{t('verifiedBadgeDesc')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">{t('higherRankings')}</p>
                            <p className="text-sm text-gray-600">{t('higherRankingsDesc')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">{t('moreReviews')}</p>
                            <p className="text-sm text-gray-600">{t('moreReviewsDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('chooseMethod')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => setVerificationMethod('email')}
                        className={`p-6 border-2 rounded-xl transition-all text-left ${verificationMethod === 'email'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <h4 className="font-bold text-gray-900 mb-2">{t('emailVerification')}</h4>
                        <p className="text-sm text-gray-600">{t('emailVerificationDesc')}</p>
                        <p className="text-xs text-gray-500 mt-2">⚡ {t('emailFastest')}</p>
                    </button>

                    <button
                        onClick={() => setVerificationMethod('document')}
                        className={`p-6 border-2 rounded-xl transition-all text-left ${verificationMethod === 'document'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <h4 className="font-bold text-gray-900 mb-2">{t('documentVerification')}</h4>
                        <p className="text-sm text-gray-600">{t('documentVerificationDesc')}</p>
                        <p className="text-xs text-gray-500 mt-2">⏱️ {t('documentTime')}</p>
                    </button>
                </div>

                {/* Email Verification Form */}
                {verificationMethod === 'email' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> {t('emailNote')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('companyEmailAddress')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('sendVerificationLink')}
                            </p>
                        </div>

                        <button
                            onClick={handleEmailVerification}
                            disabled={!companyEmail || verificationStatus === 'pending'}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('sendVerificationEmail')}
                        </button>
                    </div>
                )}

                {/* Document Verification Form */}
                {verificationMethod === 'document' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 mb-2">
                                <strong>{t('acceptedDocuments')}:</strong>
                            </p>
                            <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                                <li>{t('businessLicense')}</li>
                                <li>{t('taxCertificate')}</li>
                                <li>{t('companyCertificate')}</li>
                                <li>{t('utilityBill')}</li>
                                <li>{t('bankStatement')}</li>
                            </ul>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-700 font-medium mb-2">{t('uploadDocuments')}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {t('dragDrop')}
                            </p>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="document-upload"
                            />
                            <label
                                htmlFor="document-upload"
                                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                            >
                                {t('chooseFiles')}
                            </label>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">{t('uploadedFiles')}:</p>
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-green-900">{file.name}</span>
                                        <span className="text-xs text-green-700 ml-auto">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('additionalNotes')}
                            </label>
                            <textarea
                                rows={3}
                                placeholder={t('additionalPlaceholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleDocumentSubmit}
                            disabled={uploadedFiles.length === 0 || verificationStatus === 'pending' || isUploadingVerification}
                            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploadingVerification ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                t('submitVerification')
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
