'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Upload, CheckCircle, AlertCircle, Clock, Loader2,
    ShieldCheck, FileImage, X, Eye, ImagePlus, Building2,
    FileText, Camera, PartyPopper
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';
import Image from 'next/image';

interface UploadedFile {
    file: File;
    preview: string;
    name: string;
    size: number;
}

export default function VerificationPage() {
    const t = useTranslations('verification');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
        };
    }, [uploadedFiles]);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles: UploadedFile[] = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        clearError();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleSubmit = async () => {
        if (uploadedFiles.length === 0) return;

        const files = uploadedFiles.map(f => f.file);
        const success = await uploadVerificationDocument(files);

        if (success) {
            // Clear files after successful upload
            uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
            setUploadedFiles([]);
            // Show success message
            setShowSuccess(true);
            // Auto hide after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Show verified state
    if (verificationStatus === 'verified' || company?.verified) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                        {t('verifiedTitle') || 'Đã xác thực thành công!'}
                    </h2>
                    <p className="text-green-700 mb-6">
                        {t('verifiedDesc') || 'Công ty của bạn đã được xác thực. Badge Verified sẽ hiển thị trên trang công ty.'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                        <ShieldCheck className="w-5 h-5" />
                        {t('verified') || 'Đã xác thực'}
                    </div>
                </div>
            </div>
        );
    }

    // Show pending state
    if (verificationStatus === 'pending') {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-8 text-center">
                    <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">
                        {t('pendingTitle') || 'Đang chờ xác thực'}
                    </h2>
                    <p className="text-amber-700 mb-6">
                        {t('pendingDesc') || 'Chúng tôi đang xem xét tài liệu của bạn. Quá trình này thường mất 1-3 ngày làm việc.'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-semibold">
                        <Clock className="w-5 h-5" />
                        {t('pending') || 'Đang xử lý'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('title') || 'Xác thực doanh nghiệp'}
                </h1>
                <p className="text-gray-600">
                    {t('subtitle') || 'Tải lên giấy phép kinh doanh hoặc tài liệu chứng minh doanh nghiệp hợp pháp'}
                </p>
            </div>

            {/* Success Banner */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-green-900">{t('successTitle') || 'Gửi yêu cầu thành công!'}</p>
                        <p className="text-sm text-green-700">{t('successDesc') || 'Tài liệu của bạn đã được gửi. Chúng tôi sẽ xem xét trong 1-3 ngày làm việc.'}</p>
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 flex-1">{error}</p>
                    <button onClick={clearError} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {t('uploadDocuments') || 'Tải lên tài liệu'}
                </h3>

                {/* Accepted documents info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                        {t('acceptedDocuments') || 'Tài liệu được chấp nhận:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            {t('businessLicense') || 'Giấy phép kinh doanh'}
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            {t('taxCertificate') || 'Giấy đăng ký thuế'}
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            {t('companyCertificate') || 'Giấy chứng nhận đăng ký DN'}
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            {t('otherLegal') || 'Giấy tờ pháp lý khác'}
                        </div>
                    </div>
                </div>

                {/* Drop zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />

                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-gray-400" />
                    </div>

                    <p className="text-gray-700 font-medium mb-1">
                        {t('dragDrop') || 'Kéo thả ảnh vào đây hoặc click để chọn'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t('supportedFormats') || 'Hỗ trợ: JPG, PNG, PDF (tối đa 10MB mỗi file)'}
                    </p>
                </div>

                {/* Uploaded files preview */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            {t('selectedFiles') || 'Đã chọn'} ({uploadedFiles.length} {t('files') || 'tệp'}):
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
                                >
                                    {/* Preview image */}
                                    <div className="aspect-[4/3] relative">
                                        {file.file.type.startsWith('image/') ? (
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <FileText className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}

                                        {/* Overlay actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewImage(file.preview);
                                                }}
                                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                            >
                                                <Eye className="w-4 h-4 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                                className="p-2 bg-white rounded-full hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* File info */}
                                    <div className="p-2">
                                        <p className="text-xs text-gray-700 truncate font-medium">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Add more button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
                            >
                                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">{t('addMore') || 'Thêm ảnh'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={uploadedFiles.length === 0 || isUploadingVerification}
                    className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isUploadingVerification ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('uploading') || 'Đang tải lên...'}
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            {t('submitVerification') || 'Gửi yêu cầu xác thực'}
                        </>
                    )}
                </button>
            </div>

            {/* Benefits section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    {t('whyVerify') || 'Lợi ích khi xác thực'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{t('buildTrust') || 'Tăng độ tin cậy'}</p>
                            <p className="text-sm text-gray-600">{t('buildTrustDesc') || 'Khách hàng tin tưởng hơn'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{t('verifiedBadge') || 'Badge Verified'}</p>
                            <p className="text-sm text-gray-600">{t('verifiedBadgeDesc') || 'Hiển thị trên trang công ty'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                        onClick={() => setPreviewImage(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
