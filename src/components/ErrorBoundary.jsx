/**
 * ErrorBoundary Component - Componente para capturar erros
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-lol-dark px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Algo deu errado!
            </h1>
            
            <p className="text-gray-400 mb-8">
              Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full px-6 py-3 bg-lol-gold hover:bg-lol-gold/80 text-lol-dark font-bold rounded-lg transition-colors"
              >
                Voltar para Home
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="block w-full px-6 py-3 bg-lol-dark-secondary hover:bg-lol-gray text-white font-bold rounded-lg border border-lol-gold/30 transition-colors"
              >
                Recarregar Página
              </button>
            </div>
            
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  Detalhes técnicos
                </summary>
                <pre className="mt-4 p-4 bg-lol-dark-secondary rounded-lg text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
