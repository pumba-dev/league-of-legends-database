/**
 * LoadingSpinner Component - Spinner de loading reutilizável
 */
function LoadingSpinner({ size = 'md', text = 'Carregando...' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} border-4 border-lol-gold border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-gray-400 animate-pulse">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
