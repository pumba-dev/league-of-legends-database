/**
 * TipsSection Component - Seção de dicas para jogar com/contra o campeão
 */
import { useTranslation } from 'react-i18next'

function TipsSection({ allyTips, enemyTips }) {
  const { t } = useTranslation()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dicas para Aliados */}
      {allyTips && allyTips.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('tips.howToPlay')}
          </h3>
          <ul className="space-y-3">
            {allyTips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dicas para Inimigos */}
      {enemyTips && enemyTips.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            {t('tips.howToCounter')}
          </h3>
          <ul className="space-y-3">
            {enemyTips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TipsSection
