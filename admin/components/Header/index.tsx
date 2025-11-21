'use client'

import { Search, Sun, Moon, Bell } from 'lucide-react'
import { useState } from 'react'

export default function Header() {


  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 z-50 sticky top-0 ">
      <div className='flex items-center justify-between'>
        <div>
          {/* Theme Toggle (Light/Dark) */}Logo
        </div>
        <div className="flex items-center justify-end gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nam"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Nam Millio</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
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