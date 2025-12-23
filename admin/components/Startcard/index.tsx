interface StatCardProps {
  icon: React.ReactNode
  iconBgColor: string
  value: string
  label: string
  subtitle?: string
}

export default function StatCard({
  icon,
  iconBgColor,
  value,
  label,
  subtitle,
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

        {subtitle && (
          <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}