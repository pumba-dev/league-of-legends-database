/**
 * AbilityCard Component - Card para exibir uma habilidade do campeão
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function AbilityCard({ ability, type }) {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)
  const [showLevelTip, setShowLevelTip] = useState(false)
  const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false)
  
  // URL base para imagens de habilidades - passivas ficam em /passive/, outras em /spell/
  const imageFolder = type === 'passive' ? 'passive' : 'spell';
  const abilityImageUrl = `/database/dragontail-16.1.1/16.1.1/img/${imageFolder}/${ability.image.full}`;
  
  // Cores por tipo de habilidade
  const abilityColors = {
    passive: 'from-yellow-500 to-orange-600',
    Q: 'from-blue-500 to-cyan-600',
    W: 'from-purple-500 to-pink-600',
    E: 'from-green-500 to-emerald-600',
    R: 'from-red-500 to-rose-600'
  };

  const bgColor = abilityColors[type] || 'from-gray-500 to-gray-600';

  // Função para processar o tooltip removendo tags HTML e variáveis
  const processTooltip = (tooltip) => {
    if (!tooltip) return '';
    
    return tooltip
      // Remove variáveis {{ }}
      .replace(/\{\{[^}]+\}\}/g, '')
      // Adiciona quebra de linha antes de spellActive
      .replace(/<spellActive>/g, '')
      // Remove tags <br /> mantendo quebra de linha
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove tags de formatação mas mantém o texto
      .replace(/<[^>]+>/g, '')
      // Remove espaços múltiplos mas preserva quebras de linha
      .replace(/ +/g, ' ')
      // Remove espaços antes de pontuação
      .replace(/\s+([.,;:])/g, '$1')
      .trim();
  };

  // Função para processar leveltip
  const processLevelTip = () => {
    if (!ability.leveltip || !ability.leveltip.label || ability.leveltip.label.length === 0) {
      return null;
    }

    const labels = ability.leveltip.label;
    const translatedLabels = labels.map(label => {
      // Mapeamento de termos comuns
      const labelMap = {
        'Damage': t('abilityStats.damage') || 'Dano',
        'Cooldown': t('abilityStats.cooldown') || 'Tempo de Recarga',
        'Mana Cost': t('abilityStats.manaCost') || 'Custo de Mana',
        'Slow': t('abilityStats.slow') || 'Lentidão',
        'Healing': t('abilityStats.healing') || 'Cura',
        'Healing Increase': t('abilityStats.healingIncrease') || 'Aumento de Cura',
        'Shield': t('abilityStats.shield') || 'Escudo',
        'Duration': t('abilityStats.duration') || 'Duração',
        'Range': t('abilityStats.range') || 'Alcance',
        'Attack Damage': t('abilityStats.attackDamage') || 'Dano de Ataque',
        'Total Attack Damage Increase': t('abilityStats.totalAttackDamageIncrease') || 'Aumento de Dano Total',
        'Ability Power': t('abilityStats.abilityPower') || 'Poder de Habilidade',
        'Movement Speed': t('abilityStats.movementSpeed') || 'Velocidade de Movimento',
        'Move Speed': t('abilityStats.moveSpeed') || 'Velocidade',
      };

      return labelMap[label] || label;
    });

    return translatedLabels;
  };

  const levelTipLabels = processLevelTip();
  const processedTooltip = processTooltip(ability.tooltip);

  return (
    <div className="glass rounded-xl p-4 hover:border-lol-gold transition-all duration-300 flex flex-col h-full">
      {/* Header com ícone e nome */}
      <div className="flex items-start space-x-4 mb-3">
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br ${bgColor} p-1`}>
          <img
            src={abilityImageUrl}
            alt={ability.name}
            className="w-full h-full rounded-lg"
            onError={(e) => {
              const fallbackFolder = type === 'passive' ? 'passive' : 'spell';
              e.target.src = `https://ddragon.leagueoflegends.com/cdn/16.1.1/img/${fallbackFolder}/${ability.image.full}`;
            }}
          />
          {type !== 'passive' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-lol-gold rounded-full flex items-center justify-center text-xs font-bold text-lol-dark">
              {type}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg text-white mb-1 truncate">{ability.name}</h4>
          <p className="text-xs text-gray-400 truncate">ID: {ability.id}</p>
        </div>
      </div>

      {/* Descrição básica */}
      <div className="relative mb-3">
        <div 
          onClick={() => setShowDescriptionTooltip(!showDescriptionTooltip)}
          className="text-sm text-gray-300 leading-relaxed cursor-pointer hover:text-gray-200 transition-colors relative"
          style={{
            height: '4.5rem', // 3 linhas * 1.5rem line-height
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
          dangerouslySetInnerHTML={{ __html: ability.description }}
        />
        
        {/* Tooltip de descrição completa */}
        {showDescriptionTooltip && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDescriptionTooltip(false)}
            />
            
            {/* Tooltip */}
            <div className="absolute z-50 top-full left-0 right-0 mt-2 p-4 bg-lol-dark-secondary border-2 border-lol-gold rounded-lg shadow-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-lol-gold font-semibold">
                  {t('abilityStats.fullDescription') || 'Descrição Completa'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDescriptionTooltip(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p 
                className="text-sm text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ability.description }}
              />
            </div>
          </>
        )}
      </div>

      {/* Tooltip detalhado - Colapsável */}
      {processedTooltip && (
        <div className="mb-3 overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-lol-dark-secondary/30 rounded-t-lg border border-lol-gold/20 hover:border-lol-gold/40 transition-all"
          >
            <span className="text-xs text-lol-gold font-semibold">
              {t('abilityStats.details') || 'Detalhes'}
            </span>
            <svg 
              className={`w-4 h-4 text-lol-gold transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out ${
              showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-3 bg-lol-dark-secondary/20 rounded-b-lg border-x border-b border-lol-gold/10">
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{processedTooltip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Level Tip - Scaling ao upar - Colapsável */}
      {levelTipLabels && levelTipLabels.length > 0 && (
        <div className="mb-3 overflow-hidden">
          <button
            onClick={() => setShowLevelTip(!showLevelTip)}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-t-lg border border-purple-500/30 hover:border-purple-500/50 transition-all"
          >
            <span className="text-xs text-purple-300 font-semibold">
              📈 {t('abilityStats.scaling') || 'Melhora ao Upar'}
            </span>
            <svg 
              className={`w-4 h-4 text-purple-300 transition-transform duration-300 ${showLevelTip ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out ${
              showLevelTip ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-b-lg border-x border-b border-purple-500/20">
              <div className="flex flex-wrap gap-1">
                {levelTipLabels.map((label, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-purple-500/20 text-purple-200 rounded-md"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats da habilidade - mantém sempre no final */}
      <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
        {ability.cooldown && ability.cooldown.length > 0 && ability.cooldown[0] > 0 && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">{t('abilityStats.cooldown') || 'Cooldown'}</div>
            <div className="text-cyan-400 font-semibold">{ability.cooldownBurn}s</div>
          </div>
        )}
        
        {ability.cost && ability.cost.length > 0 && ability.cost[0] > 0 ? (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">{t('abilityStats.cost') || 'Custo'}</div>
            <div className="text-blue-400 font-semibold">{ability.costBurn}</div>
          </div>
        ) : ability.costType && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">{t('abilityStats.cost') || 'Custo'}</div>
            <div className="text-green-400 font-semibold">{ability.costType === 'No Cost' ? (t('abilityStats.noCost') || 'Sem Custo') : ability.costType}</div>
          </div>
        )}
        
        {ability.range && ability.range.length > 0 && ability.range[0] < 25000 && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">{t('abilityStats.range') || 'Alcance'}</div>
            <div className="text-green-400 font-semibold">{ability.rangeBurn}</div>
          </div>
        )}
        
        {ability.maxrank && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">{t('abilityStats.maxLevel') || 'Nível Máx'}</div>
            <div className="text-purple-400 font-semibold">{ability.maxrank}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AbilityCard
