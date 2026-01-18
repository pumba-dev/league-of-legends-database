/**
 * ItemCard Component - Card individual para cada item
 */
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getLatestVersion } from '../utils/ddragonUtils'
import { useTranslation } from 'react-i18next'

function ItemCard({ item, onTagClick }) {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState('')
  const [showStats, setShowStats] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [showPlaintext, setShowPlaintext] = useState(false)
  const [statsPosition, setStatsPosition] = useState({ top: 0, left: 0 })
  const [descriptionPosition, setDescriptionPosition] = useState({ top: 0, left: 0 })
  const [plaintextPosition, setPlaintextPosition] = useState({ top: 0, left: 0 })
  const statsTooltipRef = useRef(null)
  const descriptionTooltipRef = useRef(null)
  const plaintextTooltipRef = useRef(null)
  const statsButtonRef = useRef(null)
  const descriptionButtonRef = useRef(null)
  const plaintextButtonRef = useRef(null)

  useEffect(() => {
    const loadImageUrl = async () => {
      const version = await getLatestVersion()
      setImageUrl(`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`)
    }
    loadImageUrl()
  }, [item.image.full])

  // Calcular posição do tooltip baseada no botão
  const calculateTooltipPosition = (buttonRef) => {
    if (!buttonRef.current) return { top: 0, left: 0 }

    const rect = buttonRef.current.getBoundingClientRect()
    const tooltipWidth = 320 // Largura aproximada do tooltip
    const tooltipHeight = 200 // Altura aproximada do tooltip

    let top = rect.bottom + 8 // 8px abaixo do botão
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2) // Centralizado horizontalmente

    // Ajustar se sair da tela à direita
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 16
    }

    // Ajustar se sair da tela à esquerda
    if (left < 16) {
      left = 16
    }

    // Ajustar se sair da tela embaixo
    if (top + tooltipHeight > window.innerHeight) {
      top = rect.top - tooltipHeight - 8 // Acima do botão
    }

    return { top, left }
  }

  // Detectar cliques fora dos tooltips
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar se o clique foi nos botões
      if (statsButtonRef.current?.contains(event.target) ||
          descriptionButtonRef.current?.contains(event.target) ||
          plaintextButtonRef.current?.contains(event.target)) {
        return
      }
      
      if (statsTooltipRef.current && !statsTooltipRef.current.contains(event.target)) {
        setShowStats(false)
      }
      if (descriptionTooltipRef.current && !descriptionTooltipRef.current.contains(event.target)) {
        setShowDescription(false)
      }
      if (plaintextTooltipRef.current && !plaintextTooltipRef.current.contains(event.target)) {
        setShowPlaintext(false)
      }
    }

    if (showStats || showDescription || showPlaintext) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStats, showDescription, showPlaintext])

  // Formatar preço
  const formatGold = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  // Processar description mantendo <br> e <attention>
  const processDescription = (html, t) => {
    if (!html) return ''

    // Primeiro, substituir <br> por quebras de linha reais
    let processed = html.replace(/<br\s*\/?>/gi, '\n')

    // Substituir <attention> por <strong> para negrito
    processed = processed.replace(/<attention>/gi, '<strong>')
    processed = processed.replace(/<\/attention>/gi, '</strong>')

    // Substituir <passive> por <strong> para negrito com texto explicativo
    processed = processed.replace(/<passive>/gi, `<strong>${t('items.passive')} `)
    processed = processed.replace(/<\/passive>/gi, '</strong>')

    // Substituir <active> por <strong> para negrito com texto explicativo
    processed = processed.replace(/<active>/gi, `<strong>${t('items.active')} `)
    processed = processed.replace(/<\/active>/gi, '</strong>')

    // Remover outras tags HTML indesejadas, mas manter <strong>
    processed = processed.replace(/<(?!\/?strong\b)[^>]*>/gi, '')

    // Remover quebras de linha repetidas (2 ou mais \n consecutivos)
    processed = processed.replace(/\n{2,}/g, '\n\n')

    return processed
  }

  // Extrair stats relevantes
  const getRelevantStats = () => {
    if (!item.stats) return []

    const stats = []
    const statMapping = {
      FlatPhysicalDamageMod: 'FlatPhysicalDamageMod',
      FlatMagicDamageMod: 'FlatMagicDamageMod',
      FlatArmorMod: 'FlatArmorMod',
      FlatSpellBlockMod: 'FlatSpellBlockMod',
      FlatHPPoolMod: 'FlatHPPoolMod',
      FlatMPPoolMod: 'FlatMPPoolMod',
      PercentAttackSpeedMod: 'PercentAttackSpeedMod',
      FlatCritChanceMod: 'FlatCritChanceMod',
      PercentLifeStealMod: 'PercentLifeStealMod',
      FlatMovementSpeedMod: 'FlatMovementSpeedMod'
    }

    Object.entries(statMapping).forEach(([key, translationKey]) => {
      if (item.stats[key] && item.stats[key] !== 0) {
        const value = item.stats[key]
        const isPercent = key.includes('Percent')
        stats.push({
          name: t(`itemStats.${translationKey}`, key),
          value: isPercent ? `${(value * 100).toFixed(0)}%` : value
        })
      }
    })

    return stats
  }

  const relevantStats = getRelevantStats()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-lol-dark-secondary rounded-xl overflow-hidden border border-lol-gold/20 hover:border-lol-gold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-lol-gold/20 relative min-h-[320px] flex flex-col w-full"
      >
        {/* Gold Badges */}
        {item.gold?.total > 0 && (
          <>
            {/* Badge de Venda - Canto superior esquerdo (vermelho) */}
            {item.gold?.sell > 0 && item.gold.sell !== item.gold.total && (
              <div className="absolute top-2 left-2 glass rounded-lg px-3 py-2 backdrop-blur-md z-10">
                <div className="flex items-center space-x-1">
                  <span className="text-red-400 text-xs font-bold">
                    {formatGold(item.gold.sell)}
                  </span>
                  <span className="text-red-400 text-xs">G</span>
                  <span className={`text-[10px] font-semibold ml-1 ${((item.gold.sell - item.gold.total) / item.gold.total * 100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({((item.gold.sell - item.gold.total) / item.gold.total * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Badge de Compra - Canto superior direito (verde) */}
            <div className="absolute top-2 right-2 glass rounded-lg px-3 py-2 backdrop-blur-md z-10">
              <div className="flex items-center space-x-1">
                <span className="text-lol-gold text-xs font-bold">
                  {formatGold(item.gold.total)}
                </span>
                <span className="text-lol-gold text-xs">G</span>
              </div>
            </div>
          </>
        )}

        {/* Item Image */}
        <div className="relative bg-gradient-to-br from-lol-dark to-lol-dark-secondary p-4 overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-20 object-contain mt-10"
              loading="lazy"
            />
          )}
        </div>

        {/* Item Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
            <div>

         
          <h3 className="text-lg font-bold text-lol-gold mb-2 line-clamp-2">
            {item.name}
          </h3>

        
            {/* Plaintext */}
            <div className="mb-3">
              {item.plaintext ? (
                <button
                  ref={plaintextButtonRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!showPlaintext) {
                      setPlaintextPosition(calculateTooltipPosition(plaintextButtonRef))
                    }
                    setShowPlaintext(!showPlaintext)
                    setShowStats(false)
                    setShowDescription(false)
                  }}
                  className="text-xs text-gray-400 text-left w-full hover:text-gray-300 transition-colors cursor-pointer"
                  title={t('items.viewPlaintext', 'Ver descrição completa')}
                >
                  <span className="line-clamp-3 block overflow-hidden text-ellipsis leading-tight">
                    {item.plaintext}
                  </span>
                </button>
              ) : (
                <div className="h-[40px]"></div>
              )}
            </div>
                 </div>

          <div>   
            {/* Action Buttons */}
            <div className="flex gap-2 mb-3">
              {/* Stats Button - Always visible */}
              <button
                ref={statsButtonRef}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!showStats) {
                    setStatsPosition(calculateTooltipPosition(statsButtonRef))
                  }
                  setShowStats(!showStats)
                  setShowDescription(false)
                  setShowPlaintext(false)
                }}
                className="flex-1 text-xs px-2 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded transition-colors flex items-center justify-center gap-1"
                title={t('items.viewStats', 'Ver atributos')}
              >
                <span>📊</span>
                <span className="hidden sm:inline">{t('items.stats', 'Stats')}</span>
              </button>

              {/* Description Button */}
              {item.description && (
                <button
                  ref={descriptionButtonRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!showDescription) {
                      setDescriptionPosition(calculateTooltipPosition(descriptionButtonRef))
                    }
                    setShowDescription(!showDescription)
                    setShowStats(false)
                  }}
                  className="flex-1 text-xs px-2 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded transition-colors flex items-center justify-center gap-1"
                  title={t('items.viewDescription', 'Ver descrição')}
                >
                  <span>📜</span>
                  <span className="hidden sm:inline">{t('items.info', 'Info')}</span>
                </button>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onTagClick) {
                        onTagClick(tag)
                      }
                    }}
                    className="text-xs px-2 py-1 bg-lol-gold/20 hover:bg-lol-gold/40 text-lol-gold rounded cursor-pointer transition-colors"
                    title={t('items.clickToFilter', 'Clique para filtrar por esta tag')}
                  >
                    {t(`itemTags.${tag}`, tag)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Tooltip Portal */}
      {showStats && createPortal(
        <div
          ref={statsTooltipRef}
          className="fixed z-[9999] w-80 p-3 bg-lol-dark border border-lol-gold rounded-lg shadow-2xl"
          style={{
            top: `${statsPosition.top}px`,
            left: `${statsPosition.left}px`,
            maxWidth: '320px'
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-lol-gold">{t('items.stats', 'Stats')}</span>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-400 hover:text-white text-xs"
            >✕</button>
          </div>
          {relevantStats.length > 0 ? (
            <div className="space-y-1.5">
              {relevantStats.map((stat, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-300">{stat.name}</span>
                  <span className="text-lol-gold font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm mb-2">📊</div>
              <div className="text-gray-300 text-sm">
                {t('items.noStats', 'Este item não possui atributos adicionais.')}
              </div>
              <div className="text-gray-500 text-xs mt-2">
                {t('items.noStatsDescription', 'Seus efeitos são baseados em habilidades ou passivas.')}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Description Tooltip Portal */}
      {showDescription && item.description && createPortal(
        <motion.div
          ref={descriptionTooltipRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[9999] w-96 bg-lol-dark border border-lol-gold rounded-lg shadow-2xl overflow-hidden"
          style={{
            top: `${descriptionPosition.top}px`,
            left: `${descriptionPosition.left}px`,
            maxWidth: '400px'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-lol-gold/20 bg-lol-dark/95">
            <span className="text-sm font-semibold text-lol-gold flex items-center gap-2">
              <span>📜</span>
              {t('items.description', 'Descrição')}
            </span>
            <button
              onClick={() => setShowDescription(false)}
              className="text-gray-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-all duration-200 group"
              title={t('items.close', 'Fechar')}
            >
              <span className="group-hover:rotate-90 transition-transform duration-200">×</span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-lol-gold/30 scrollbar-track-transparent hover:scrollbar-thumb-lol-gold/50">
            <div
              className="px-4 py-4 text-sm text-gray-200 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processDescription(item.description, t) }}
            />
          </div>

          {/* Footer with gradient fade if scrollable */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-lol-dark to-transparent pointer-events-none"></div>
        </motion.div>,
        document.body
      )}

      {/* Plaintext Tooltip Portal */}
      {showPlaintext && item.plaintext && createPortal(
        <motion.div
          ref={plaintextTooltipRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[9999] w-80 bg-lol-dark border border-lol-gold rounded-lg shadow-2xl overflow-hidden"
          style={{ 
            top: `${plaintextPosition.top}px`, 
            left: `${plaintextPosition.left}px`,
            maxWidth: '320px'
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-lol-gold/20 bg-lol-dark/95">
            <span className="text-sm font-semibold text-lol-gold flex items-center gap-2">
              <span>📝</span>
              {t('items.plaintext', 'Descrição')}
            </span>
            <button 
              onClick={() => setShowPlaintext(false)}
              className="text-gray-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-all duration-200 group"
              title={t('items.close', 'Fechar')}
            >
              <span className="group-hover:rotate-90 transition-transform duration-200">×</span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-lol-gold/30 scrollbar-track-transparent hover:scrollbar-thumb-lol-gold/50">
            <div className="px-4 py-4 text-sm text-gray-200 leading-relaxed">
              {item.plaintext}
            </div>
          </div>

          {/* Footer with gradient fade if scrollable */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-lol-dark to-transparent pointer-events-none"></div>
        </motion.div>,
        document.body
      )}
    </>
  )
}

export default ItemCard