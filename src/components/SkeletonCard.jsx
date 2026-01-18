/**
 * SkeletonCard Component - Loading placeholder para cards de campeões
 */
function SkeletonCard() {
  return (
    <div className="bg-lol-dark-secondary rounded-xl overflow-hidden border border-lol-gold/20 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-700 skeleton" />
      
      {/* Content placeholder */}
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2 skeleton" />
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3 skeleton" />
        
        {/* Tags placeholder */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-700 rounded-full skeleton" />
          <div className="h-6 w-20 bg-gray-700 rounded-full skeleton" />
        </div>
        
        {/* Stats placeholder */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 bg-gray-700 rounded skeleton" />
          <div className="h-8 bg-gray-700 rounded skeleton" />
          <div className="h-8 bg-gray-700 rounded skeleton" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard
