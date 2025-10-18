export default function SkeletonPortfolio() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
        </div>
      </div>
    </div>
  )
}
