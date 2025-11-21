import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  iconBgColor: string
  value: string
  label: string
  change: number
  isPositive: boolean
}

export default function StatCard({
  icon,
  iconBgColor,
  value,
  label,
  change,
  isPositive,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`${iconBgColor} w-12 h-12 rounded-full flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-500 text-sm mt-1">{label}</p>
        
        <div className="flex items-center gap-1 mt-3">
          <span className={`flex items-center text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </span>
        </div>
      </div>
    </div>
  )
}