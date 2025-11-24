'use client';

import { useState } from 'react';
import { ShieldCheck, Upload, Mail, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

type VerificationStatus = 'not-started' | 'pending' | 'verified' | 'rejected';

export default function VerificationPage() {
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'document'>('email');
    const [status, setStatus] = useState<VerificationStatus>('not-started');
    const [companyEmail, setCompanyEmail] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleEmailVerification = () => {
        setStatus('pending');
        // Simulate sending verification email
        setTimeout(() => {
            alert('Verification email sent! Please check your inbox.');
        }, 1000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    const handleDocumentSubmit = () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one document');
            return;
        }
        setStatus('pending');
        alert('Documents submitted for review. We will verify within 2-3 business days.');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Business Verification</h2>
                <p className="text-gray-500 mt-1">Verify your business to build trust with customers</p>
            </div>

            {/* Status Banner */}
            {status === 'verified' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="text-lg font-bold text-green-900">Business Verified!</h3>
                            <p className="text-green-700">Your business has been successfully verified</p>
                        </div>
                    </div>
                </div>
            )}

            {status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div>
                            <h3 className="text-lg font-bold text-yellow-900">Verification Pending</h3>
                            <p className="text-yellow-700">We are reviewing your submission. This usually takes 2-3 business days.</p>
                        </div>
                    </div>
                </div>
            )}

            {status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                        <div>
                            <h3 className="text-lg font-bold text-red-900">Verification Rejected</h3>
                            <p className="text-red-700">Please review the requirements and submit again with valid documents.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Why Verify Your Business?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Build Trust</p>
                            <p className="text-sm text-gray-600">Show customers you're a legitimate business</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Verified Badge</p>
                            <p className="text-sm text-gray-600">Get a verified badge on your profile</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">Higher Rankings</p>
                            <p className="text-sm text-gray-600">Verified businesses rank higher in search</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900">More Reviews</p>
                            <p className="text-sm text-gray-600">Customers trust verified businesses more</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Choose Verification Method</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => setVerificationMethod('email')}
                        className={`p-6 border-2 rounded-xl transition-all text-left ${verificationMethod === 'email'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Mail className="h-8 w-8 text-blue-600 mb-3" />
                        <h4 className="font-bold text-gray-900 mb-2">Company Email Verification</h4>
                        <p className="text-sm text-gray-600">Verify using your company domain email</p>
                        <p className="text-xs text-gray-500 mt-2">⚡ Fastest method (instant)</p>
                    </button>

                    <button
                        onClick={() => setVerificationMethod('document')}
                        className={`p-6 border-2 rounded-xl transition-all text-left ${verificationMethod === 'document'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <FileText className="h-8 w-8 text-blue-600 mb-3" />
                        <h4 className="font-bold text-gray-900 mb-2">Document Verification</h4>
                        <p className="text-sm text-gray-600">Upload business license or tax documents</p>
                        <p className="text-xs text-gray-500 mt-2">⏱️ 2-3 business days</p>
                    </button>
                </div>

                {/* Email Verification Form */}
                {verificationMethod === 'email' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> You must have access to an email address with your company domain
                                (e.g., yourname@yourcompany.com). Free email providers like Gmail, Yahoo are not accepted.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="yourname@company.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                We'll send a verification link to this email
                            </p>
                        </div>

                        <button
                            onClick={handleEmailVerification}
                            disabled={!companyEmail || status === 'pending'}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send Verification Email
                        </button>
                    </div>
                )}

                {/* Document Verification Form */}
                {verificationMethod === 'document' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 mb-2">
                                <strong>Accepted Documents:</strong>
                            </p>
                            <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                                <li>Business License (Giấy phép kinh doanh)</li>
                                <li>Tax Registration Certificate (Giấy đăng ký thuế)</li>
                                <li>Company Registration Certificate</li>
                                <li>Recent Utility Bill with company name</li>
                                <li>Bank Statement with company name</li>
                            </ul>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-700 font-medium mb-2">Upload Documents</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Drag and drop or click to browse (PDF, JPG, PNG)
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
                                Choose Files
                            </label>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
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
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Any additional information about your business..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleDocumentSubmit}
                            disabled={uploadedFiles.length === 0 || status === 'pending'}
                            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit for Verification
                        </button>
                    </div>
                )}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">How long does verification take?</h4>
                        <p className="text-sm text-gray-600">
                            Email verification is instant. Document verification takes 2-3 business days.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">What if my verification is rejected?</h4>
                        <p className="text-sm text-gray-600">
                            You can resubmit with different documents. We'll provide feedback on why it was rejected.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Is verification required?</h4>
                        <p className="text-sm text-gray-600">
                            No, but verified businesses get more trust and visibility on our platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
