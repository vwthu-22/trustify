'use client'

import { FileText, Check, X, ExternalLink, Clock } from 'lucide-react'

export default function VerificationPage() {
    const requests = [
        { id: 1, company: 'Sunrise Cafe', type: 'Business License', submitted: '2 hours ago', status: 'Pending', documents: ['license.pdf', 'tax_id.jpg'] },
        { id: 2, company: 'Tech Solutions Ltd.', type: 'Identity Verification', submitted: '5 hours ago', status: 'Pending', documents: ['passport.jpg'] },
        { id: 3, company: 'Green Earth Organics', type: 'Business License', submitted: '1 day ago', status: 'Pending', documents: ['registration.pdf'] },
        { id: 4, company: 'Urban Outfitters', type: 'Ownership Proof', submitted: '2 days ago', status: 'Pending', documents: ['utility_bill.pdf'] },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 mt-1">Review and approve business verification documents</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        4 Pending
                    </span>
                </div>
            </div>

            <div className="grid gap-4">
                {requests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{request.company}</h3>
                                <p className="text-gray-600 text-sm mb-2">{request.type} • Submitted {request.submitted}</p>
                                <div className="flex gap-2">
                                    {request.documents.map((doc, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                                            <FileText className="w-3 h-3" />
                                            {doc}
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                                <X className="w-4 h-4" />
                                Reject
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
