export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse">
      {/* Icon skeleton */}
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mb-6"></div>
      
      {/* Title skeleton */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
      
      {/* Button skeleton */}
      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  )
}
