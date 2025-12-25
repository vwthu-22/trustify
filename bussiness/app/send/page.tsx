'use client';

import { useState } from 'react';
import { Mail, Upload, Eye, Send, X, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const emailTemplates = [
    {
        id: 'standard',
        name: 'Standard Template',
        subject: 'We value your feedback!',
        content: `Dear {{name}},

Thank you for choosing {{company}}! We hope you enjoyed your recent experience with {{service}}.

We would love to hear your thoughts. Your feedback helps us improve our services.

Please take a moment to share your review.

Best regards,
{{branch}} Team`
    },
    {
        id: 'friendly',
        name: 'Friendly Template',
        subject: 'How did we do?',
        content: `Hi {{name}}!

Thanks for being an awesome customer! We hope you loved {{service}}.

Mind sharing your experience? It only takes a minute and means the world to us.

Cheers,
{{branch}} Team`
    },
    {
        id: 'professional',
        name: 'Professional Template',
        subject: 'Request for Feedback',
        content: `Dear {{name}},

We appreciate your business with {{company}}.

As part of our commitment to excellence, we would be grateful if you could provide feedback on your recent experience with {{service}}.

Your input is valuable to us.

Sincerely,
{{branch}} Management`
    }
];

export default function SendInvitationsPage() {
    const t = useTranslations('invitations');
    const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'auto'>('single');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        branch: 'hanoi',
        service: ''
    });
    const [selectedTemplate, setSelectedTemplate] = useState('standard');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleSendSingle = () => {
        setSendStatus('sending');
        setTimeout(() => {
            setSendStatus('success');
            setTimeout(() => setSendStatus('idle'), 3000);
        }, 1500);
    };

    const currentTemplate = emailTemplates.find(t => t.id === selectedTemplate);

    const previewContent = currentTemplate?.content
        .replace('{{name}}', formData.name || '[Customer Name]')
        .replace('{{company}}', 'FundedNext Ltd')
        .replace('{{service}}', formData.service || '[Service/Product]')
        .replace('{{branch}}', formData.branch === 'hanoi' ? 'Hà Nội' : formData.branch === 'hcm' ? 'TP.HCM' : 'Đà Nẵng');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('single')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'single'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {t('sendSingle')}
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'bulk'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {t('bulkSend')}
                </button>
                <button
                    onClick={() => setActiveTab('auto')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'auto'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {t('autoSend')}
                </button>
            </div>

            {/* Single Send Tab */}
            {activeTab === 'single' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">{t('customerInfo')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="customer@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                >
                                    <option value="hanoi">Hà Nội</option>
                                    <option value="hcm">TP.HCM</option>
                                    <option value="danang">Đà Nẵng</option>
                                    <option value="cantho">Cần Thơ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service/Product
                                </label>
                                <input
                                    type="text"
                                    placeholder="Product X"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Template
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                >
                                    {emailTemplates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                {showPreview ? 'Hide Preview' : 'Preview Email'}
                            </button>

                            {sendStatus === 'success' ? (
                                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-medium">Invitation sent successfully!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSendSingle}
                                    disabled={!formData.email || sendStatus === 'sending'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                    {sendStatus === 'sending' ? 'Sending...' : 'Send Invitation'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Email Preview</h3>
                        {showPreview ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                                    <p className="text-gray-900">{currentTemplate?.subject}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Message:</p>
                                    <p className="text-gray-900 whitespace-pre-line">{previewContent}</p>
                                </div>
                                <div className="p-4 bg-blue-500 text-white rounded-lg text-center">
                                    <button className="font-semibold">Leave a Review</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-400">
                                <div className="text-center">
                                    <Mail className="h-16 w-16 mx-auto mb-4" />
                                    <p>Click &quot;Preview Email&quot; to see the invitation</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bulk Send Tab */}
            {activeTab === 'bulk' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Bulk Send Invitations</h3>
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-700 font-medium mb-2">
                                Upload CSV or Excel file
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Drag and drop or click to browse
                            </p>
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                            >
                                Choose File
                            </label>
                        </div>

                        {uploadedFile && (
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-900">{uploadedFile.name}</p>
                                        <p className="text-sm text-green-700">
                                            {(uploadedFile.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUploadedFile(null)}
                                    className="text-green-700 hover:text-green-900"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-2">Required CSV Format:</p>
                            <code className="text-sm text-blue-800">
                                email, name, service, branch
                            </code>
                            <div className="mt-3">
                                <a
                                    href="/sample-template.csv"
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Download sample template
                                </a>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Template
                            </label>
                            <select className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                {emailTemplates.map(template => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Send Time
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="sendTime" value="now" defaultChecked className="w-4 h-4" />
                                    <span className="text-sm text-gray-700">Send immediately</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="sendTime" value="schedule" className="w-4 h-4" />
                                    <span className="text-sm text-gray-700">Schedule for later</span>
                                </label>
                            </div>
                        </div>

                        <button
                            disabled={!uploadedFile}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send to All Customers
                        </button>
                    </div>
                </div>
            )}

            {/* Auto Send Tab */}
            {activeTab === 'auto' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Automatic Sending Rules</h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Automatic invitations will be sent based on order completion or service delivery.
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5" defaultChecked />
                                <div>
                                    <p className="font-medium text-gray-900">Enable Auto-Send</p>
                                    <p className="text-sm text-gray-600">Automatically send review invitations after purchase</p>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Send After
                            </label>
                            <select className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="1">1 day after delivery</option>
                                <option value="3">3 days after delivery</option>
                                <option value="7">7 days after delivery</option>
                                <option value="14">14 days after delivery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Template
                            </label>
                            <select className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                {emailTemplates.map(template => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5" />
                                <div>
                                    <p className="font-medium text-gray-900">Send Reminder</p>
                                    <p className="text-sm text-gray-600">Send a follow-up reminder if no review after 7 days</p>
                                </div>
                            </label>
                        </div>

                        <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}