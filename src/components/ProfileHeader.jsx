/**
 * ProfileHeader Component - Cabeçalho do perfil do jogador
 * Exibe informações principais: ícone, nome, nível, elos
 */
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getProfileIconUrl, getTierColor } from '../utils/riotApiUtils'

function ProfileHeader({ summoner, account, rankedData, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation()

  if (!summoner || !account) return null

  // Encontrar dados de Solo/Duo e Flex
  const soloQueue = rankedData?.find(entry => entry.queueType === 'RANKED_SOLO_5x5')
  const flexQueue = rankedData?.find(entry => entry.queueType === 'RANKED_FLEX_SR')

  /**
   * Renderizar card de ranked
   */
  const RankCard = ({ queue, type }) => {
    if (!queue) {
      return (
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-sm font-semibold text-gray-400 mb-2">
            {type === 'solo' ? t('profile.soloQueue') : t('profile.flexQueue')}
          </div>
          <div className="text-gray-500 text-sm">{t('profile.unranked')}</div>
        </div>
      )
    }

    const winrate = ((queue.wins / (queue.wins + queue.losses)) * 100).toFixed(1)
    const tierColor = getTierColor(queue.tier)

    return (
      <motion.div 
        className="glass rounded-xl p-4 text-center relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: `linear-gradient(135deg, ${tierColor} 0%, transparent 100%)` }}
        />
        
        <div className="relative z-10">
          <div className="text-xs font-semibold text-gray-400 mb-2">
            {type === 'solo' ? t('profile.soloQueue') : t('profile.flexQueue')}
          </div>
          
          {/* Tier */}
          <div 
            className="text-2xl font-bold mb-1"
            style={{ color: tierColor }}
          >
            {queue.tier} {queue.rank}
          </div>
          
          {/* LP */}
          <div className="text-lol-gold font-semibold text-sm mb-2">
            {queue.leaguePoints} LP
          </div>
          
          {/* Wins/Losses */}
          <div className="flex justify-center gap-2 text-xs mb-1">
            <span className="text-green-400">{queue.wins}V</span>
            <span className="text-gray-500">/</span>
            <span className="text-red-400">{queue.losses}D</span>
          </div>
          
          {/* Winrate */}
          <div className="text-xs text-gray-400">
            {t('profile.winrate')}: <span className="text-white font-semibold">{winrate}%</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Ícone do perfil */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-lol-gold shadow-2xl">
              <img 
                src={getProfileIconUrl(summoner.profileIconId)} 
                alt="Profile Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/29.png'
                }}
              />
            </div>
            {/* Nível */}
            <div className="absolute -bottom-2 -right-2 bg-lol-gold text-lol-dark font-bold text-sm px-3 py-1 rounded-full shadow-lg">
              {summoner.summonerLevel}
            </div>
          </motion.div>

          {/* Informações principais */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                {account.gameName}
                <span className="text-gray-500 text-xl">#{account.tagLine}</span>
              </h1>
              {onToggleFavorite && (
                <motion.button
                  onClick={onToggleFavorite}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-2xl transition-all ${
                    isFavorite
                      ? 'text-lol-gold drop-shadow-[0_0_8px_rgba(200,155,60,0.8)]'
                      : 'text-gray-600 hover:text-lol-gold'
                  }`}
                  title={isFavorite ? t('profile.removeFavorite', 'Remover favorito') : t('profile.addFavorite', 'Adicionar aos favoritos')}
                >
                  {isFavorite ? '★' : '☆'}
                </motion.button>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-lol-gold">📍</span>
                <span>{summoner.region?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lol-gold">⭐</span>
                <span>{t('profile.level')} {summoner.summonerLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Ranked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RankCard queue={soloQueue} type="solo" />
        <RankCard queue={flexQueue} type="flex" />
      </div>
    </div>
  )
}

export default ProfileHeader
