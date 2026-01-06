'use client'

import { Search, Bell, LogOut, User, Settings, Shield, MessageCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import useAdminAuthStore from '@/store/useAdminAuthStore'
import { useSupportChatStore } from '@/store/useSupportChatStore'

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const tSidebar = useTranslations('sidebar');
  const { adminUser, isAuthenticated, logout, checkAuthStatus } = useAdminAuthStore();
  const {
    notifications,
    unreadNotificationCount,
    markAllNotificationsAsRead,
    connect,
    disconnect,
    fetchTickets,
    isConnected,
    openChatWidget
  } = useSupportChatStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load admin user from store/localStorage
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Initialize WebSocket connection globally (so notifications work on all pages)
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      const initChat = async () => {
        await fetchTickets('');
        connect('');
      };
      initChat();
    }
    // Don't disconnect on unmount - Header stays mounted
  }, [isAuthenticated, isConnected]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    const path = pathname?.replace('/', '') || 'dashboard';
    const titleMap: Record<string, string> = {
      'dashboard': tSidebar('dashboard'),
      'users': tSidebar('users'),
      'companies': tSidebar('companies'),
      'companies/verification': tSidebar('verificationRequests'),
      'moderation': tSidebar('moderation'),
      'support': tSidebar('support'),
      'billing': tSidebar('billing'),
      'settings': tSidebar('settings'),
      'profile': tCommon('profile'),
    };
    return titleMap[path] || tSidebar('dashboard');
  };

  // Get display name (email)
  const displayName = adminUser?.email || 'Admin';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 z-50 sticky top-0 ml-64">
      <div className='flex items-center justify-between'>
        {/* Page Title */}
        <div>
          <h1 className="text-2xl text-gray-900">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center justify-end gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              title={t('notifications')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{t('notifications')}</h3>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {t('markAllRead') || 'Mark all as read'}
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('noNotifications') || 'No new messages'}</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          openChatWidget(notif.ticketId);
                          setShowNotifications(false);
                        }}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${notif.read ? 'opacity-60' : ''}`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {notif.companyName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{notif.companyName}</p>
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {t('newMessage') || 'có tin nhắn mới'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button
                    onClick={() => {
                      openChatWidget();
                      setShowNotifications(false);
                    }}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    {t('viewAll') || 'View all messages'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated && adminUser ? (
              // User is logged in - show profile dropdown
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg py-1 pr-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm max-w-[150px] truncate">{displayName}</p>
                    <p className="text-xs text-gray-500">{tCommon('adminPanel')}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500">{adminUser.role}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          router.push('/profile')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        {tCommon('profile')}
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          router.push('/settings')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        {tCommon('settings')}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // User is NOT logged in - show login button
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 pl-4 border-l border-gray-200 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                {tCommon('login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}