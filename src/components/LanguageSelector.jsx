/**
 * LanguageSelector Component - Seletor de idioma
 */
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'pt-BR', name: t('language.portuguese'), flag: '🇧🇷' },
    { code: 'en-US', name: t('language.english'), flag: '🇺🇸' },
    { code: 'es-ES', name: t('language.spanish'), flag: '🇪🇸' },
    { code: 'fr-FR', name: t('language.french'), flag: '🇫🇷' },
    { code: 'it-IT', name: t('language.italian'), flag: '🇮🇹' },
    { code: 'zh-CN', name: t('language.chinese'), flag: '🇨🇳' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('language', languageCode)
    setIsOpen(false)
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-lol-dark-secondary border border-lol-gold/30 hover:border-lol-gold transition-colors"
        aria-label={t('language.select')}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm text-gray-300 hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-lol-dark-secondary border border-lol-gold/30 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-lol-gold/10 transition-colors ${
                language.code === i18n.language ? 'bg-lol-gold/20 text-lol-gold' : 'text-gray-300'
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
              {language.code === i18n.language && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
