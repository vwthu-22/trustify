'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle, Star, Layout, Grid, Maximize2 } from 'lucide-react';

interface Widget {
    id: string;
    name: string;
    type: 'carousel' | 'grid' | 'mini' | 'popup';
    description: string;
    preview: string;
}

const widgets: Widget[] = [
    {
        id: 'carousel',
        name: 'Carousel Widget',
        type: 'carousel',
        description: 'Rotating reviews in a carousel format',
        preview: '🎠'
    },
    {
        id: 'grid',
        name: 'Grid Widget',
        type: 'grid',
        description: 'Display reviews in a grid layout',
        preview: '📊'
    },
    {
        id: 'mini',
        name: 'Mini Widget',
        type: 'mini',
        description: 'Compact widget showing rating summary',
        preview: '⭐'
    },
    {
        id: 'popup',
        name: 'Popup Widget',
        type: 'popup',
        description: 'Reviews appear in a popup modal',
        preview: '💬'
    }
];

export default function WidgetsPage() {
    const [selectedWidget, setSelectedWidget] = useState<Widget>(widgets[0]);
    const [copied, setCopied] = useState(false);
    const [config, setConfig] = useState({
        theme: 'light',
        starColor: '#FFD700',
        maxReviews: 5,
        autoRotate: true,
        showDate: true,
        showBranch: true
    });

    const generateCode = () => {
        return `<!-- Trustify Widget -->
<div id="trustify-widget-${selectedWidget.type}" 
     data-theme="${config.theme}"
     data-star-color="${config.starColor}"
     data-max-reviews="${config.maxReviews}"
     data-auto-rotate="${config.autoRotate}"
     data-show-date="${config.showDate}"
     data-show-branch="${config.showBranch}">
</div>
<script src="https://cdn.trustify.com/widget.js" async></script>`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">TrustBox Widgets</h2>
                <p className="text-gray-500 mt-1">Embed reviews on your website to build trust</p>
            </div>

            {/* Widget Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {widgets.map((widget) => (
                    <button
                        key={widget.id}
                        onClick={() => setSelectedWidget(widget)}
                        className={`p-6 border-2 rounded-xl transition-all text-left ${selectedWidget.id === widget.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <div className="text-4xl mb-3">{widget.preview}</div>
                        <h3 className="font-bold text-gray-900 mb-2">{widget.name}</h3>
                        <p className="text-sm text-gray-600">{widget.description}</p>
                    </button>
                ))}
            </div>

            {/* Configuration & Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Widget Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Theme
                            </label>
                            <select
                                value={config.theme}
                                onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Star Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={config.starColor}
                                    onChange={(e) => setConfig({ ...config, starColor: e.target.value })}
                                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.starColor}
                                    onChange={(e) => setConfig({ ...config, starColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Reviews to Display
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={config.maxReviews}
                                onChange={(e) => setConfig({ ...config, maxReviews: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.autoRotate}
                                    onChange={(e) => setConfig({ ...config, autoRotate: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Auto-rotate reviews</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.showDate}
                                    onChange={(e) => setConfig({ ...config, showDate: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Show review date</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.showBranch}
                                    onChange={(e) => setConfig({ ...config, showBranch: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Show branch name</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Widget Preview</h3>
                    <div className={`p-6 rounded-lg ${config.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        {selectedWidget.type === 'carousel' && (
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                                    <div className="flex gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5" fill={config.starColor} color={config.starColor} />
                                        ))}
                                    </div>
                                    <p className={`text-sm mb-2 ${config.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        "Excellent service! Highly recommended."
                                    </p>
                                    <div className={`flex items-center justify-between text-xs ${config.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <span>John Doe</span>
                                        {config.showDate && <span>2 days ago</span>}
                                    </div>
                                    {config.showBranch && (
                                        <span className={`text-xs ${config.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Hà Nội Branch
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                </div>
                            </div>
                        )}

                        {selectedWidget.type === 'grid' && (
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].slice(0, config.maxReviews).map((i) => (
                                    <div key={i} className={`p-3 rounded-lg ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                                        <div className="flex gap-0.5 mb-2">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="h-3 w-3" fill={config.starColor} color={config.starColor} />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${config.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Great!
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedWidget.type === 'mini' && (
                            <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow text-center`}>
                                <div className="flex justify-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6" fill={config.starColor} color={config.starColor} />
                                    ))}
                                </div>
                                <p className={`text-2xl font-bold ${config.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4.5</p>
                                <p className={`text-sm ${config.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Based on 1,234 reviews</p>
                            </div>
                        )}

                        {selectedWidget.type === 'popup' && (
                            <div className="relative">
                                <button className={`w-full p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow flex items-center justify-between`}>
                                    <span className={config.theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                                        See what customers say
                                    </span>
                                    <Star className="h-5 w-5" fill={config.starColor} color={config.starColor} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Embed Code */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Embed Code</h3>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
                <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                    <code>{generateCode()}</code>
                </pre>
                <p className="text-sm text-gray-600 mt-4">
                    Copy and paste this code into your website's HTML where you want the widget to appear.
                </p>
            </div>

            {/* Installation Guide */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Installation Guide</h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    <li>Select your preferred widget type and customize the settings</li>
                    <li>Copy the generated embed code</li>
                    <li>Paste the code into your website's HTML</li>
                    <li>The widget will automatically display your latest reviews</li>
                </ol>
            </div>
        </div>
    );
}
