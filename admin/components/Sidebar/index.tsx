'use client'

import {
  Home,
  Users,
  Building2,
  ShieldAlert,
  MessageSquare,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  FileCheck
} from 'lucide-react'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['companies'])

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: 'users',
      icon: Users,
      label: 'Users',
      path: '/users'
    },
    {
      key: 'companies',
      icon: Building2,
      label: 'Companies',
      subItems: [
        { label: 'All Companies', path: '/companies' },
        { label: 'Verification Requests', path: '/companies/verification', icon: FileCheck }
      ]
    },
    {
      key: 'moderation',
      icon: ShieldAlert,
      label: 'Content Moderation',
      path: '/moderation'
    },
    {
      key: 'support',
      icon: MessageSquare,
      label: 'Support Center',
      path: '/support'
    },
    {
      key: 'billing',
      icon: CreditCard,
      label: 'Billing & Plans',
      path: '/billing'
    },
    {
      key: 'settings',
      icon: Settings,
      label: 'System Settings',
      path: '/settings'
    }
  ]

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen z-50 fixed top-0 left-0 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 block leading-none">Trustify</span>
            <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedMenus.includes(item.key)
          const hasSubItems = item.subItems && item.subItems.length > 0
          const active = isActive(item.path || '') || (hasSubItems && item.subItems?.some(sub => isActive(sub.path)))

          return (
            <div key={item.key}>
              <button
                onClick={() => hasSubItems ? toggleMenu(item.key) : router.push(item.path!)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active && !hasSubItems
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active && !hasSubItems ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {hasSubItems && (
                  isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {hasSubItems && isExpanded && (
                <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.path}
                      onClick={() => router.push(subItem.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive(subItem.path)
                          ? 'text-blue-600 bg-blue-50 font-medium'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@trustify.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}