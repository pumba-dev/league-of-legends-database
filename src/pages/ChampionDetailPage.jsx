/**
 * ChampionDetailPage Component - Página de detalhes completos do campeão
 * Exibe todas as informações, estatísticas, habilidades, skins e gráficos
 * ATUALIZADO: Usando database completa do dragontail
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import StatsRadarChart from '../components/StatsRadarChart'
import BaseStatsChart from '../components/BaseStatsChart'
import AbilityCard from '../components/AbilityCard'
import SkinsGallery from '../components/SkinsGallery'
import TipsSection from '../components/TipsSection'

function ChampionDetailPage() {
  const { championId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [champion, setChampion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoreExpanded, setIsLoreExpanded] = useState(false)

  useEffect(() => {
    const loadChampion = async () => {
      setLoading(true)
      try {
        const response = await fetch('/champions-full.json')
        const championsArray = await response.json()
        
        // Buscar campeão específico
        const championData = championsArray.find(c => c.id === championId)
        
        if (championData) {
          setChampion(championData)
        }
      } catch (error) {
        console.error('Erro ao carregar campeão:', error)
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }

    loadChampion()
  }, [championId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lol-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('champion.loading')}</p>
        </div>
      </div>
    )
  }

  if (!champion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-500 mb-4">{t('champion.notFound')}</h2>
          <Link to="/" className="text-lol-gold hover:text-white transition-colors">
            {t('champion.backToList')}
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`
  const squareImageUrl = `https://ddragon.leagueoflegends.com/cdn/16.1.1/img/champion/${champion.image.full}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="animate-fade-in"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-lol-gold transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{t('champion.back')}</span>
      </button>

      {/* Hero Section with Splash Art */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-96 md:h-[500px]">
        <img
          src={imageUrl}
          alt={champion.name}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-lol-dark via-lol-dark/70 to-transparent" />
        
        {/* Champion Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end space-x-6">
            {/* Square Icon */}
            <motion.img
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={squareImageUrl}
              alt={champion.name}
              className="w-32 h-32 rounded-xl border-4 border-lol-gold shadow-2xl hidden md:block"
            />
            
            {/* Title and Name */}
            <div className="flex-1">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold gradient-text mb-2"
              >
                {champion.name}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 italic"
              >
                {champion.title}
              </motion.p>
              
              {/* Tags */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {champion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-lol-dark-secondary/80 backdrop-blur-md border border-lol-gold/30 rounded-lg text-lol-gold font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Lore and Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lore Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              {t('champion.lore')}
            </h2>
            
            <div className="text-gray-300 leading-relaxed">
              {isLoreExpanded && champion.lore ? (
                <div className="space-y-4">
                  {champion.lore.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph}</p>
                    )
                  ))}
                </div>
              ) : (
                <p>{champion.blurb}</p>
              )}
            </div>
            
            {champion.lore && champion.lore !== champion.blurb && (
              <button
                onClick={() => setIsLoreExpanded(!isLoreExpanded)}
                className="mt-4 text-sm text-lol-gold hover:text-white transition-colors flex items-center gap-1"
              >
                {isLoreExpanded ? '← Voltar ao resumo' : 'Ler história completa →'}
              </button>
            )}
          </motion.div>

          {/* Base Stats Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('champion.baseStats')}
            </h2>
            <BaseStatsChart stats={champion.stats} />
          </motion.div>

          {/* Detailed Stats Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-lol-gold mb-4">{t('champion.detailedStats')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'hp', label: t('statNames.hp'), value: champion.stats.hp, perLevel: champion.stats.hpperlevel, color: 'text-green-400', icon: '❤️' },
                { key: 'hpRegen', label: t('statNames.hpRegen'), value: champion.stats.hpregen.toFixed(1), perLevel: champion.stats.hpregenperlevel, color: 'text-green-400', icon: '💚' },
                { key: 'mana', label: t('statNames.mana'), value: champion.stats.mp, perLevel: champion.stats.mpperlevel, color: 'text-blue-400', icon: '💧' },
                { key: 'manaRegen', label: t('statNames.manaRegen'), value: champion.stats.mpregen.toFixed(1), perLevel: champion.stats.mpregenperlevel, color: 'text-blue-400', icon: '💙' },
                { key: 'attackDamage', label: t('statNames.attackDamage'), value: champion.stats.attackdamage, perLevel: champion.stats.attackdamageperlevel, color: 'text-red-400', icon: '⚔️' },
                { key: 'attackSpeed', label: t('statNames.attackSpeed'), value: champion.stats.attackspeed.toFixed(3), perLevel: champion.stats.attackspeedperlevel, color: 'text-orange-400', icon: '⚡' },
                { key: 'armor', label: t('statNames.armor'), value: champion.stats.armor, perLevel: champion.stats.armorperlevel, color: 'text-yellow-400', icon: '🛡️' },
                { key: 'magicResist', label: t('statNames.magicResist'), value: champion.stats.spellblock, perLevel: champion.stats.spellblockperlevel, color: 'text-purple-400', icon: '✨' },
                { key: 'moveSpeed', label: t('statNames.moveSpeed'), value: champion.stats.movespeed, color: 'text-cyan-400', icon: '👟' },
                { key: 'attackRange', label: t('statNames.attackRange'), value: champion.stats.attackrange, color: 'text-pink-400', icon: '🎯' },
              ].map((stat, index) => {
                let level18Value = null;
                
                if (stat.perLevel) {
                  // Cálculo especial para Attack Speed (multiplicativo)
                  if (stat.key === 'attackSpeed') {
                    const asBase = parseFloat(stat.value);
                    const asPerLevel = parseFloat(stat.perLevel) / 100; // Converter para decimal
                    const levelsGained = 17; // Nível 18 - 1
                    const bonusTotal = levelsGained * asPerLevel;
                    level18Value = (asBase * (1 + bonusTotal)).toFixed(3);
                  } else {
                    // Cálculo linear para outras estatísticas
                    level18Value = (parseFloat(stat.value) + (parseFloat(stat.perLevel) * 17)).toFixed(1);
                  }
                }
                
                return (
                  <div key={index} className="bg-lol-dark-secondary/50 rounded-lg p-4 border border-lol-gold/10 hover:border-lol-gold/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stat.icon}</span>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      {stat.perLevel && (
                        <div className="text-sm text-gray-500">
                          <span className="text-lol-gold">+{stat.perLevel}</span> /nv
                        </div>
                      )}
                    </div>
                    
                    {level18Value && (
                      <div className="mt-2 pt-2 border-t border-lol-gold/10">
                        <div className="text-xs text-gray-500">Nível 18:</div>
                        <div className={`text-sm font-semibold ${stat.color}`}>
                          {level18Value}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Passive Ability */}
          {champion.passive && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                {t('champion.passive')}
              </h2>
              <AbilityCard ability={champion.passive} type="passive" />
            </motion.div>
          )}

          {/* Abilities (Q, W, E, R) */}
          {champion.spells && champion.spells.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                {t('champion.abilities')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {champion.spells.map((spell, index) => (
                  <AbilityCard 
                    key={spell.id} 
                    ability={spell} 
                    type={['Q', 'W', 'E', 'R'][index]} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Skins Gallery */}
          {champion.skins && champion.skins.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                {t('champion.skins')} ({champion.skins.length})
              </h2>
              <SkinsGallery skins={champion.skins} championId={champion.id} />
            </motion.div>
          )}

          {/* Tips Section */}
          {(champion.allytips?.length > 0 || champion.enemytips?.length > 0) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <TipsSection allyTips={champion.allytips} enemyTips={champion.enemytips} />
            </motion.div>
          )}
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Stats Radar Chart */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-lol-gold mb-4">{t('champion.attributes')}</h2>
            <StatsRadarChart info={champion.info} />
          </motion.div>

          {/* Quick Info Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-lol-gold mb-4">{t('champion.quickInfo')}</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">{t('champion.resource')}</div>
                <div className="text-lg font-semibold text-lol-blue">{champion.partype}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-2">{t('champion.difficultyLevel')}</div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < champion.info.difficulty ? 'bg-lol-gold' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {champion.info.difficulty <= 3 ? t('champion.easy') : champion.info.difficulty <= 6 ? t('champion.medium') : t('champion.hard')}
                </div>
              </div>

              <div className="pt-4 border-t border-lol-gold/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{champion.info.attack}</div>
                    <div className="text-xs text-gray-500">{t('champion.attack')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{champion.info.defense}</div>
                    <div className="text-xs text-gray-500">{t('champion.defense')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{champion.info.magic}</div>
                    <div className="text-xs text-gray-500">{t('champion.magic')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{champion.info.difficulty}</div>
                    <div className="text-xs text-gray-500">{t('champion.difficulty')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Version Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="glass rounded-xl p-4 text-center text-sm text-gray-500"
          >
            <p>{t('champion.version')}: 16.1.1</p>
            <p className="mt-1">{t('champion.id')}: {champion.key}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChampionDetailPage
