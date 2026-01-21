'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle, Terminal, Zap, FileJson, Mail, Key, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';

export default function IntegrationsPage() {
    const t = useTranslations('integrations');
    const { company } = useCompanyStore();
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'rating' | 'reviews' | 'invite'>('overview');

    // API Token Generator states
    const [tokenEmail, setTokenEmail] = useState('');
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [isExchangingToken, setIsExchangingToken] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [tokenError, setTokenError] = useState('');

    const companyId = company?.id || '{YOUR_COMPANY_ID}';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

    const handleCopy = (text: string, endpoint: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    // Generate state code from email
    const handleGenerateCode = async () => {
        if (!tokenEmail || !tokenEmail.includes('@')) {
            setTokenError('Please enter a valid email address');
            return;
        }

        setIsGeneratingCode(true);
        setTokenError('');
        setGeneratedCode('');
        setAccessToken('');

        try {
            const response = await fetch(`${baseUrl}/integration/companies/getCode/${encodeURIComponent(tokenEmail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate code. Please check your email.');
            }

            const code = await response.text();

            if (!code || code === 'null') {
                throw new Error('Email not found in system');
            }

            setGeneratedCode(code);
        } catch (error) {
            console.error('Generate code error:', error);
            setTokenError(error instanceof Error ? error.message : 'Failed to generate code');
        } finally {
            setIsGeneratingCode(false);
        }
    };

    // Exchange state code for access token
    const handleExchangeToken = async () => {
        if (!generatedCode) {
            setTokenError('Please generate a code first');
            return;
        }

        setIsExchangingToken(true);
        setTokenError('');

        try {
            const response = await fetch(`${baseUrl}/api/auth/exchange-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ state: generatedCode }),
            });

            if (!response.ok) {
                throw new Error('Failed to exchange token');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.token) {
                setAccessToken(data.token);
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Exchange token error:', error);
            setTokenError(error instanceof Error ? error.message : 'Failed to exchange token');
        } finally {
            setIsExchangingToken(false);
        }
    };

    const endpoints = [
        {
            id: 'overview',
            method: 'GET',
            name: t('endpoints.overview.name'),
            path: `/integration/companies/${companyId}`,
            description: t('endpoints.overview.description'),
            icon: FileJson,
            color: 'blue'
        },
        {
            id: 'rating',
            method: 'GET',
            name: t('endpoints.rating.name'),
            path: `/integration/companies/${companyId}/rating`,
            description: t('endpoints.rating.description'),
            icon: Zap,
            color: 'green'
        },
        {
            id: 'reviews',
            method: 'GET',
            name: t('endpoints.reviews.name'),
            path: `/integration/companies/${companyId}/reviews`,
            description: t('endpoints.reviews.description'),
            icon: Terminal,
            color: 'purple'
        },
        {
            id: 'invite',
            method: 'POST',
            name: t('endpoints.invite.name'),
            path: `/integration/companies/${companyId}/send-invite`,
            description: t('endpoints.invite.description'),
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
                            {t('apiDescriptions.overviewDesc')}
                        </p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">{t('response')}</p>
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
                            {t('apiDescriptions.ratingDesc')}
                        </p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">{t('response')}</p>
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
                            <p className="text-sm font-medium text-blue-800 mb-2">💡 {t('tips.title')}</p>
                            <p className="text-sm text-blue-700">
                                {t('tips.ratingTip')}
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
                            {t('apiDescriptions.reviewsDesc')}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <p className="text-sm font-medium text-gray-700 mb-2">{t('queryParameters')}</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">page</code>
                                    <span className="text-sm text-gray-600">{t('params.page')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">size</code>
                                    <span className="text-sm text-gray-600">{t('params.size')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">{t('response')}</p>
                            <pre className="text-sm text-green-400">
                                {`{
  "content": [
    {
      "id": 1,
      "rating": 5,
      "title": "Excellent service!",
      "comment": "Very satisfied with the quality...",
      "userName": "John Doe",
      "createdAt": "2024-01-09T10:30:00"
    },
    {
      "id": 2,
      "rating": 4,
      "title": "Good",
      "comment": "Quality product...",
      "userName": "Jane Smith",
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
                            {t('apiDescriptions.inviteDesc')}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <p className="text-sm font-medium text-gray-700 mb-2">{t('queryParameters')}</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">to</code>
                                    <div>
                                        <span className="text-sm text-gray-600">{t('params.to')}</span>
                                        <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">{t('required')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">subject</code>
                                    <span className="text-sm text-gray-600">{t('params.subject')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-200 rounded text-xs">body</code>
                                    <span className="text-sm text-gray-600">{t('params.body')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <p className="text-xs text-gray-400 mb-2">{t('exampleRequest')}</p>
                            <pre className="text-sm text-yellow-400 mb-4">
                                {`POST /integration/companies/${companyId}/send-invite
     ?to=customer@email.com
     &subject=Please review our service`}
                            </pre>
                            <p className="text-xs text-gray-400 mb-2">{t('response')}</p>
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
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] rounded-xl p-4 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Code className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{t('title')}</h1>
                        <p className="text-white/70 text-sm">{t('subtitle')}</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs text-white/60 mb-1">{t('baseUrl')}</p>
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
                        <p className="text-xs text-green-300">✓ {t('yourCompanyId')}: <span className="font-mono font-bold">{company.id}</span></p>
                    </div>
                )}
            </div>

            {/* API Token Generator */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Key className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">API Token Generator</h2>
                        <p className="text-sm text-gray-600">Generate access token for third-party integrations</p>
                    </div>
                </div>

                {/* Error Message */}
                {tokenError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{tokenError}</p>
                    </div>
                )}

                {/* Step 1: Enter Email */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Step 1: Enter Company Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={tokenEmail}
                                onChange={(e) => setTokenEmail(e.target.value)}
                                placeholder="company@example.com"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={isGeneratingCode}
                            />
                            <button
                                onClick={handleGenerateCode}
                                disabled={isGeneratingCode || !tokenEmail}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            >
                                {isGeneratingCode ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Key className="h-4 w-4" />
                                        Generate Code
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Enter the email address associated with your company account
                        </p>
                    </div>

                    {/* Step 2: Generated Code */}
                    {generatedCode && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-purple-900">
                                    Step 2: State Code Generated
                                </label>
                                <button
                                    onClick={() => handleCopy(generatedCode, 'stateCode')}
                                    className="p-1.5 hover:bg-purple-100 rounded transition-colors"
                                >
                                    {copiedEndpoint === 'stateCode' ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-purple-600" />
                                    )}
                                </button>
                            </div>
                            <code className="block p-3 bg-white rounded border border-purple-300 text-sm font-mono text-purple-900 break-all">
                                {generatedCode}
                            </code>
                            <button
                                onClick={handleExchangeToken}
                                disabled={isExchangingToken}
                                className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                            >
                                {isExchangingToken ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Exchanging...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4" />
                                        Exchange for Access Token
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Access Token */}
                    {accessToken && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-green-900 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Step 3: Access Token Ready
                                </label>
                                <button
                                    onClick={() => handleCopy(accessToken, 'accessToken')}
                                    className="p-1.5 hover:bg-green-100 rounded transition-colors"
                                >
                                    {copiedEndpoint === 'accessToken' ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-green-600" />
                                    )}
                                </button>
                            </div>
                            <code className="block p-3 bg-white rounded border border-green-300 text-xs font-mono text-green-900 break-all max-h-32 overflow-y-auto">
                                {accessToken}
                            </code>
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-medium text-blue-900 mb-2">💡 How to use this token:</p>
                                <pre className="text-xs text-blue-800 bg-white p-2 rounded border border-blue-200 overflow-x-auto">
                                    {`// Add to your API requests
fetch('${baseUrl}/integration/companies/${companyId}/rating', {
  headers: {
    'Authorization': 'Bearer ${accessToken.substring(0, 20)}...'
  }
})`}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
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
                    <span className="text-sm font-medium text-gray-700">{t('jsIntegrationExample')}</span>
                </div>
                <div className="bg-gray-900 p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        {`// ${t('codeComments.fetchAndDisplay')}
const COMPANY_ID = ${companyId};
const API_BASE = '${baseUrl}';

// ${t('codeComments.getRatingOverview')}
async function fetchRating() {
  const res = await fetch(\`\${API_BASE}/integration/companies/\${COMPANY_ID}/rating\`);
  const data = await res.json();
  
  document.getElementById('rating-badge').innerHTML = \`
    \${data.averageRating.toFixed(1)}/5 (\${data.totalReviews} ${t('codeComments.reviews')})
  \`;
}

// ${t('codeComments.getAndDisplayReviews')}
async function fetchReviews(page = 0, size = 5) {
  const res = await fetch(
    \`\${API_BASE}/integration/companies/\${COMPANY_ID}/reviews?page=\${page}&size=\${size}\`
  );
  const data = await res.json();
  
  const reviewsHtml = data.content.map(review => \`
    <div class="review-card">
      <div class="stars">\${'★'.repeat(review.rating)}</div>
      <h4>\${review.title}</h4>
      <p>\${review.comment}</p>
      <span class="author">\${review.userName}</span>
    </div>
  \`).join('');
  
  document.getElementById('reviews-container').innerHTML = reviewsHtml;
}

// ${t('codeComments.initialize')}
fetchRating();
fetchReviews();`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
