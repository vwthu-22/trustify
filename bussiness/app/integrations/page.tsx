'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle, ExternalLink, Terminal, Zap, FileJson, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';

export default function IntegrationsPage() {
    const t = useTranslations('integrations');
    const { company } = useCompanyStore();
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'rating' | 'reviews' | 'invite'>('overview');

    const companyId = company?.id || '{YOUR_COMPANY_ID}';
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.trustify.com';

    const handleCopy = (text: string, endpoint: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const endpoints = [
        {
            id: 'overview',
            method: 'GET',
            name: 'Integration Manifest',
            path: `/integration/companies/${companyId}`,
            description: 'Lấy thông tin tổng quan API và rating hiện tại',
            icon: FileJson,
            color: 'blue'
        },
        {
            id: 'rating',
            method: 'GET',
            name: 'Company Rating',
            path: `/integration/companies/${companyId}/rating`,
            description: 'Lấy thống kê đánh giá (điểm TB, phân bố sao)',
            icon: Zap,
            color: 'green'
        },
        {
            id: 'reviews',
            method: 'GET',
            name: 'Company Reviews',
            path: `/integration/companies/${companyId}/reviews`,
            description: 'Lấy danh sách đánh giá (có phân trang)',
            icon: Terminal,
            color: 'purple'
        },
        {
            id: 'invite',
            method: 'POST',
            name: 'Send Invitation',
            path: `/integration/companies/${companyId}/send-invite`,
            description: 'Gửi email mời khách hàng đánh giá',
            icon: Mail,
            color: 'orange'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', light: 'bg-blue-50' },
            green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', light: 'bg-green-50' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', light: 'bg-purple-50' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500', light: 'bg-orange-50' }
        };
        return colors[color] || colors.blue;
    };

    const renderApiContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">GET</span>
                            <code className="text-sm text-gray-700 flex-1">/integration/companies/{companyId}</code>
                            <button
                                onClick={() => handleCopy(`${baseUrl}/integration/companies/${companyId}`, 'overview')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {copiedEndpoint === 'overview' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Trả về thông tin tổng quan về các API endpoint có sẵn và rating hiện tại của công ty.
                        </p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">Response</p>
                            <pre className="text-sm text-green-400">
                                {`{
  "sendInviteApi": "/integration/companies/${companyId}/send-invite",
  "ratingApi": "/integration/companies/${companyId}/rating",
  "reviewsApi": "/integration/companies/${companyId}/reviews",
  "companyRating": {
    "id": ${companyId},
    "averageRating": 4.5,
    "totalReviews": 128,
    "fiveStarCount": 80,
    "fourStarCount": 30,
    "threeStarCount": 10,
    "twoStarCount": 5,
    "oneStarCount": 3
  }
}`}
                            </pre>
                        </div>
                    </div>
                );

            case 'rating':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">GET</span>
                            <code className="text-sm text-gray-700 flex-1">/integration/companies/{companyId}/rating</code>
                            <button
                                onClick={() => handleCopy(`${baseUrl}/integration/companies/${companyId}/rating`, 'rating')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {copiedEndpoint === 'rating' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Lấy thống kê chi tiết về đánh giá của công ty: điểm trung bình, tổng số đánh giá, phân bố theo số sao.
                        </p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">Response</p>
                            <pre className="text-sm text-green-400">
                                {`{
  "id": ${companyId},
  "averageRating": 4.5,
  "totalReviews": 128,
  "fiveStarCount": 80,
  "fourStarCount": 30,
  "threeStarCount": 10,
  "twoStarCount": 5,
  "oneStarCount": 3
}`}
                            </pre>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-800 mb-2">💡 Gợi ý sử dụng</p>
                            <p className="text-sm text-blue-700">
                                Sử dụng API này để hiển thị badge đánh giá trên website của bạn, ví dụ: "⭐ 4.5/5 (128 đánh giá)"
                            </p>
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">GET</span>
                            <code className="text-sm text-gray-700 flex-1">/integration/companies/{companyId}/reviews</code>
                            <button
                                onClick={() => handleCopy(`${baseUrl}/integration/companies/${companyId}/reviews?page=0&size=10`, 'reviews')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {copiedEndpoint === 'reviews' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Lấy danh sách đánh giá của công ty với hỗ trợ phân trang.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <p className="text-sm font-medium text-gray-700 mb-2">Query Parameters</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">page</code>
                                    <span className="text-sm text-gray-600">Số trang (mặc định: 0)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">size</code>
                                    <span className="text-sm text-gray-600">Số lượng mỗi trang (mặc định: 20)</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">Response</p>
                            <pre className="text-sm text-green-400">
                                {`{
  "content": [
    {
      "id": 1,
      "rating": 5,
      "title": "Dịch vụ tuyệt vời!",
      "comment": "Rất hài lòng với chất lượng...",
      "userName": "Nguyễn Văn A",
      "createdAt": "2024-01-09T10:30:00"
    },
    {
      "id": 2,
      "rating": 4,
      "title": "Tốt",
      "comment": "Sản phẩm chất lượng...",
      "userName": "Trần Thị B",
      "createdAt": "2024-01-08T15:20:00"
    }
  ],
  "totalElements": 128,
  "totalPages": 13,
  "size": 10,
  "number": 0
}`}
                            </pre>
                        </div>
                    </div>
                );

            case 'invite':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">POST</span>
                            <code className="text-sm text-gray-700 flex-1">/integration/companies/{companyId}/send-invite</code>
                            <button
                                onClick={() => handleCopy(`${baseUrl}/integration/companies/${companyId}/send-invite?to=customer@email.com`, 'invite')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {copiedEndpoint === 'invite' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Gửi email mời khách hàng để lại đánh giá. Email sẽ chứa link để khách hàng đánh giá công ty của bạn.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <p className="text-sm font-medium text-gray-700 mb-2">Query Parameters</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">to</code>
                                    <div>
                                        <span className="text-sm text-gray-600">Email người nhận</span>
                                        <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">Bắt buộc</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">subject</code>
                                    <span className="text-sm text-gray-600">Tiêu đề email (tùy chọn)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">body</code>
                                    <span className="text-sm text-gray-600">Nội dung tùy chỉnh (tùy chọn)</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">Example Request</p>
                            <pre className="text-sm text-yellow-400 mb-4">
                                {`POST /integration/companies/${companyId}/send-invite
     ?to=customer@email.com
     &subject=Xin hãy đánh giá dịch vụ của chúng tôi`}
                            </pre>
                            <p className="text-xs text-gray-400 mb-2">Response</p>
                            <pre className="text-sm text-green-400">
                                {`{
  "status": "sent",
  "to": "customer@email.com",
  "reviewLink": "https://trustify.com/review?companyId=${companyId}"
}`}
                            </pre>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Code className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">API Documentation</h1>
                        <p className="text-white/70 text-sm">Tích hợp đánh giá vào website của bạn</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">Base URL</p>
                    <div className="flex items-center gap-2">
                        <code className="text-sm text-white flex-1">{baseUrl}/integration/companies</code>
                        <button
                            onClick={() => handleCopy(`${baseUrl}/integration/companies`, 'base')}
                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        >
                            {copiedEndpoint === 'base' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/60" />}
                        </button>
                    </div>
                </div>
                {company && (
                    <div className="mt-3 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                        <p className="text-xs text-green-300">✓ Company ID của bạn: <span className="font-mono font-bold">{company.id}</span></p>
                    </div>
                )}
            </div>

            {/* API Endpoints Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {endpoints.map((endpoint) => {
                    const colors = getColorClasses(endpoint.color);
                    const Icon = endpoint.icon;
                    const isActive = activeTab === endpoint.id;

                    return (
                        <button
                            key={endpoint.id}
                            onClick={() => setActiveTab(endpoint.id as typeof activeTab)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${isActive
                                ? `${colors.border} ${colors.light} shadow-md`
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1.5 rounded-lg ${isActive ? colors.bg : 'bg-gray-100'}`}>
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                </div>
                                <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${endpoint.method === 'GET'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {endpoint.method}
                                </span>
                            </div>
                            <p className={`text-sm font-semibold ${isActive ? colors.text : 'text-gray-900'}`}>
                                {endpoint.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{endpoint.description}</p>
                        </button>
                    );
                })}
            </div>

            {/* API Detail */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {renderApiContent()}
            </div>

            {/* Code Example */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Ví dụ tích hợp JavaScript</span>
                </div>
                <div className="bg-gray-900 p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        {`// Lấy và hiển thị reviews trên website của bạn
const COMPANY_ID = ${companyId};
const API_BASE = '${baseUrl}';

// 1. Lấy rating tổng quan
async function fetchRating() {
  const res = await fetch(\`\${API_BASE}/integration/companies/\${COMPANY_ID}/rating\`);
  const data = await res.json();
  
  document.getElementById('rating-badge').innerHTML = \`
    ⭐ \${data.averageRating.toFixed(1)}/5 (\${data.totalReviews} đánh giá)
  \`;
}

// 2. Lấy và hiển thị reviews
async function fetchReviews(page = 0, size = 5) {
  const res = await fetch(
    \`\${API_BASE}/integration/companies/\${COMPANY_ID}/reviews?page=\${page}&size=\${size}\`
  );
  const data = await res.json();
  
  const reviewsHtml = data.content.map(review => \`
    <div class="review-card">
      <div class="stars">\${'⭐'.repeat(review.rating)}</div>
      <h4>\${review.title}</h4>
      <p>\${review.comment}</p>
      <span class="author">\${review.userName}</span>
    </div>
  \`).join('');
  
  document.getElementById('reviews-container').innerHTML = reviewsHtml;
}

// Khởi chạy
fetchRating();
fetchReviews();`}
                    </pre>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                    href="#"
                    className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Xem tài liệu đầy đủ</p>
                        <p className="text-xs text-blue-600">Hướng dẫn chi tiết và ví dụ nâng cao</p>
                    </div>
                </a>
                <a
                    href="#"
                    className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                >
                    <div className="p-2 bg-purple-500 rounded-lg">
                        <Code className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-purple-900">Widget sẵn sàng sử dụng</p>
                        <p className="text-xs text-purple-600">Nhúng widget đánh giá với 1 dòng code</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
