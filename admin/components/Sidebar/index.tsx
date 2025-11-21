'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, User, FileText, Table, BarChart3, Layers, Lock } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Forms', path: '/forms' },
    { icon: Table, label: 'Tables', path: '/tables' },
    { icon: FileText, label: 'Pages', path: '/pages' },
  ]

  const othersMenuItems = [
    { icon: BarChart3, label: 'Charts', path: '/charts' },
    { icon: Layers, label: 'UI Elements', path: '/ui-elements' },
    { icon: Lock, label: 'Authentication', path: '/authentication' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen z-50 fixed top-0 left-0 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin-slow"></div>
          </div>
          <span className="text-xl font-bold text-gray-900">Next Admin</span>
        </div>
      </div>

      <nav className="px-4">
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </h3>

          {mainMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1 ${isActive(item.path)
                    ? 'bg-indigo-50 text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Others
          </h3>

          {othersMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1 ${isActive(item.path)
                    ? 'bg-indigo-50 text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}