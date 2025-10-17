export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
