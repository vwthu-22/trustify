'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useBusinessAuthStore from '@/stores/businessAuthStore/business';

export default function BusinessRegister() {
  const router = useRouter();
  const { registerBusiness, verifyOtp, resendOtp, isLoading, error, successMessage, clearError, clearSuccess } = useBusinessAuthStore();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    website: '',
    companyName: '',
    name: '',
    jobTitle: '',
    workEmail: '',
    country: '',
    phoneNumber: '',
    industry: '',
    numberOfEmployees: '',
    annualRevenue: ''
  });

  // Industry options
  const industries = [
    { slug: 'bank', name: 'Bank' },
    { slug: 'travel', name: 'Travel Insurance' },
    { slug: 'car-dealer', name: 'Car Dealer' },
    { slug: 'furniture-store', name: 'Furniture Store' },
    { slug: 'jewelry-store', name: 'Jewelry Store' },
    { slug: 'clothing-store', name: 'Clothing Store' },
    { slug: 'electronics', name: 'Electronics & Technology' },
    { slug: 'fitness', name: 'Fitness and Nutrition Service' }
  ];

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  // Show success/error messages
  useEffect(() => {
    if (successMessage) {
      console.log('Success:', successMessage);
    }
    if (error) {
      console.error('Error:', error);
      alert(error);
      clearError();
    }
  }, [successMessage, error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    const success = await registerBusiness(formData);

    if (success) {
      setShowOtpModal(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpCode.join('');
    console.log('Verifying OTP:', code);

    const success = await verifyOtp(formData.workEmail, code);

    if (success) {
      router.push('/dashboard');
    }
  };

  const handleResendOtp = async () => {
    console.log('Resending OTP to:', formData.workEmail);
    await resendOtp(formData.workEmail);
    setOtpCode(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex mt-16">
      <aside className="hidden lg:block w-1/3 bg-white p-12 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>

        <div className="relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-16 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-2 mb-12">
            <svg className="w-8 h-8 text-[#0095b6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <div className="text-2xl font-bold">Trustify</div>
              <div className="text-sm text-gray-600">For Business</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Build credibility with reviews</h3>
              </div>
              <p className="text-gray-600 ml-9">
                Collect trustworthy reviews on an open, transparent platform millions of consumers use.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Strengthen your reputation</h3>
              </div>
              <p className="text-gray-600 ml-9">
                94% of new users that automated review invites increased their TrustScore*
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Grow performance</h3>
              </div>
              <p className="text-gray-600 ml-9">
                Trustify stars and content are proven to convert at higher rates than those of competitors
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <h1 className="text-3xl text-center font-bold text-gray-900 mb-8">Create a free account</h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Website"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Company name"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <input
                  type="text"
                  placeholder="Job title"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <input
                  type="email"
                  placeholder="Work email"
                  required
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                    >
                      <option value="">Country</option>
                      <option value="US">United States</option>
                      <option value="VN">Vietnam</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="relative">
                  <select
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                  >
                    <option value="">Number of employees</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={formData.annualRevenue}
                    onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                  >
                    <option value="">Annual revenue</option>
                    <option value="0-100k">$0 - $100k</option>
                    <option value="100k-500k">$100k - $500k</option>
                    <option value="500k-1m">$500k - $1M</option>
                    <option value="1m-10m">$1M - $10M</option>
                    <option value="10m+">$10M+</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                  >
                    <option value="">--Select industry--</option>
                    {industries.map((industry) => (
                      <option key={industry.slug} value={industry.slug}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition text-md"
              >
                {isLoading ? 'Creating account...' : 'Create free account'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
              <p className="text-gray-600">
                We've sent a verification code to<br />
                <span className="font-semibold text-gray-900">{formData.workEmail}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 6-digit code
              </label>
              <div className="flex gap-2 justify-center">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={otpCode.some(digit => !digit) || isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {isLoading ? 'Verifying...' : 'Verify and Continue'}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
                >
                  {isLoading ? 'Sending...' : 'Resend'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}