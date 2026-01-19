import { Link, useLocation } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'

/**
 * Layout Component - Estrutura principal da aplicação
 * Inclui header, navegação e container para o conteúdo
 */
function Layout({ children }) {
  const { t } = useTranslation()
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-lol-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-lol-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-lol-gold to-lol-blue rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-lol-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{t('header.title')}</h1>
                <p className="text-xs text-gray-400">{t('header.subtitle')}</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-lol-gold/20 text-lol-gold' 
                      : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
                  }`}
                >
                  {t('nav.champions', 'Campeões')}
                </Link>
                <Link
                  to="/items"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/items' 
                      ? 'bg-lol-gold/20 text-lol-gold' 
                      : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
                  }`}
                >
                  {t('nav.items', 'Itens')}
                </Link>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/profile' 
                      ? 'bg-lol-gold/20 text-lol-gold' 
                      : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
                  }`}
                >
                  {t('nav.profile', 'Perfil')}
                </Link>
              </nav>
              
              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center space-x-2 mt-4">
            <Link
              to="/"
              className={`flex-1 text-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-lol-gold/20 text-lol-gold' 
                  : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
              }`}
            >
              {t('nav.champions', 'Campeões')}
            </Link>
            <Link
              to="/items"
              className={`flex-1 text-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/items' 
                  ? 'bg-lol-gold/20 text-lol-gold' 
                  : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
              }`}
            >
              {t('nav.items', 'Itens')}
            </Link>
            <Link
              to="/profile"
              className={`flex-1 text-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/profile' 
                  ? 'bg-lol-gold/20 text-lol-gold' 
                  : 'text-gray-400 hover:text-lol-gold hover:bg-lol-gold/10'
              }`}
            >
              {t('nav.profile', 'Perfil')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-lol-gold/20 bg-lol-dark-secondary">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p className="text-sm">
            {t('footer.developed')}
          </p>
          <p className="text-xs mt-2">
            {t('footer.disclaimer')}
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}

export default Layout
