'use client';

import { useState } from 'react';
import { Mail, Plus, Edit, Trash2, Eye, Copy, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    category: 'standard' | 'friendly' | 'professional' | 'custom';
    usageCount: number;
}

const initialTemplates: EmailTemplate[] = [
    {
        id: '1',
        name: 'Standard Template',
        subject: 'We value your feedback!',
        content: `Dear {{name}},

Thank you for choosing {{company}}! We hope you enjoyed your recent experience with {{service}}.

We would love to hear your thoughts. Your feedback helps us improve our services.

Please take a moment to share your review.

Best regards,
{{branch}} Team`,
        category: 'standard',
        usageCount: 245
    },
    {
        id: '2',
        name: 'Friendly Template',
        subject: 'How did we do? 😊',
        content: `Hi {{name}}!

Thanks for being an awesome customer! We hope you loved {{service}}.

Mind sharing your experience? It only takes a minute and means the world to us.

Cheers,
{{branch}} Team`,
        category: 'friendly',
        usageCount: 189
    },
    {
        id: '3',
        name: 'Professional Template',
        subject: 'Request for Feedback',
        content: `Dear {{name}},

We appreciate your business with {{company}}.

As part of our commitment to excellence, we would be grateful if you could provide feedback on your recent experience with {{service}}.

Your input is valuable to us.

Sincerely,
{{branch}} Management`,
        category: 'professional',
        usageCount: 156
    }
];

export default function EmailTemplatesPage() {
    const t = useTranslations('templates');
    const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (template: EmailTemplate) => {
        const newTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (Copy)`,
            usageCount: 0
        };
        setTemplates([...templates, newTemplate]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const previewContent = selectedTemplate?.content
        .replace('{{name}}', 'John Doe')
        .replace('{{company}}', 'Your Company')
        .replace('{{service}}', 'Premium Service')
        .replace('{{branch}}', 'Hà Nội');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    {t('createTemplate')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600">{t('totalTemplates')}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{templates.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600">{t('totalSent')}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600">{t('mostUsed')}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                        {templates.sort((a, b) => b.usageCount - a.usageCount)[0]?.name}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600">{t('customTemplates')}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {templates.filter(t => t.category === 'custom').length}
                    </p>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>{t('subject')}:</strong> {template.subject}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {template.category}
                                    </span>
                                    <span>Used {template.usageCount} times</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line">
                                {template.content}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setShowPreview(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                {t('preview')}
                            </button>
                            <button
                                onClick={() => handleCopy(template)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Copy className="h-4 w-4" />
                                {t('duplicate')}
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setIsEditing(true);
                                }}
                                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(template.id)}
                                className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {
                showPreview && selectedTemplate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">{t('templatePreview')}</h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">{t('from')}:</p>
                                    <p className="text-gray-900">noreply@trustify.com</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">{t('subject')}:</p>
                                    <p className="text-gray-900">{selectedTemplate.subject}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-3">{t('message')}:</p>
                                    <p className="text-gray-900 whitespace-pre-line">{previewContent}</p>
                                </div>
                                <div className="p-4 bg-blue-500 text-white rounded-lg text-center">
                                    <button className="font-semibold text-lg">{t('leaveReview')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Available Variables */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('availableVariables')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                        <code className="text-sm text-blue-600 font-mono">{'{{name}}'}</code>
                        <p className="text-xs text-gray-600 mt-1">{t('customerName')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                        <code className="text-sm text-blue-600 font-mono">{'{{company}}'}</code>
                        <p className="text-xs text-gray-600 mt-1">{t('companyName')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                        <code className="text-sm text-blue-600 font-mono">{'{{service}}'}</code>
                        <p className="text-xs text-gray-600 mt-1">{t('serviceProduct')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                        <code className="text-sm text-blue-600 font-mono">{'{{branch}}'}</code>
                        <p className="text-xs text-gray-600 mt-1">{t('branchName')}</p>
                    </div>
                </div>
            </div>
        </div >
    );
}

function X(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
