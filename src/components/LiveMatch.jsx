/**
 * LiveMatch Component - Partida ao vivo do jogador
 * Exibe informações da partida em andamento com auto-refresh
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getQueueName } from '../utils/riotApiUtils'

function LiveMatch({ liveGame, version = '14.1.1' }) {
  const { t } = useTranslation()
  const [gameTime, setGameTime] = useState(0)

  // Atualizar tempo de jogo a cada segundo
  useEffect(() => {
    if (!liveGame) return

    const startTime = Date.now() - (liveGame.gameLength * 1000)
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setGameTime(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [liveGame])

  // Formatar tempo de jogo
  const formatGameTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  // Se não há partida ao vivo
  if (!liveGame) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="text-6xl mb-4">😴</div>
        <div className="text-xl font-bold text-gray-400 mb-2">
          {t('profile.notInGame')}
        </div>
        <div className="text-sm text-gray-500">
          {t('profile.notInGameDesc')}
        </div>
      </div>
    )
  }

  // Separar participantes por time
  const blueTeam = liveGame.participants.filter(p => p.teamId === 100)
  const redTeam = liveGame.participants.filter(p => p.teamId === 200)

  /**
   * Renderizar participante
   */
  const ParticipantRow = ({ participant, isCurrentPlayer }) => {
    const championImg = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championId}.png`
    const spell1Img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${participant.spell1Id}.png`
    const spell2Img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${participant.spell2Id}.png`

    const handleImageError = (e) => {
      e.target.style.display = 'none'
    }

    return (
      <div className={`flex items-center gap-2 p-2 rounded ${isCurrentPlayer ? 'bg-lol-gold/20' : ''}`}>
        {/* Campeão */}
        <img
          src={championImg}
          alt="Champion"
          className="w-10 h-10 rounded"
          onError={handleImageError}
        />

        {/* Summoner Spells */}
        <div className="flex flex-col gap-0.5">
          <img src={spell1Img} alt="Spell 1" className="w-4 h-4 rounded" onError={handleImageError} />
          <img src={spell2Img} alt="Spell 2" className="w-4 h-4 rounded" onError={handleImageError} />
        </div>

        {/* Nome */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">
            {participant.summonerName || participant.riotId}
          </div>
          {/* Rank poderia ser exibido aqui se disponível */}
        </div>
      </div>
    )
  }

  /**
   * Renderizar bans
   */
  const BansList = ({ bans }) => {
    if (!bans || bans.length === 0) return null

    const handleImageError = (e) => {
      e.target.style.display = 'none'
    }

    return (
      <div className="flex gap-1 justify-center flex-wrap">
        {bans.map((ban, index) => (
          <div key={`ban-${ban.championId}-${ban.pickTurn || index}`} className="relative group">
            {ban.championId > 0 ? (
              <>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban.championId}.png`}
                  alt="Banned"
                  className="w-8 h-8 rounded opacity-50 grayscale"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xl">×</span>
                </div>
              </>
            ) : (
              <div className="w-8 h-8 bg-lol-dark/50 rounded" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header com status AO VIVO */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Indicador AO VIVO */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-xl font-bold text-red-500">
              🔴 {t('profile.liveMatch')}
            </span>
          </div>

          {/* Info da partida */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-400">{t('profile.gameMode')}:</span>{' '}
              <span className="text-lol-gold font-semibold">
                {getQueueName(liveGame.gameQueueConfigId)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">{t('profile.gameTime')}:</span>{' '}
              <span className="text-lol-gold font-semibold text-lg">
                {formatGameTime(gameTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bans */}
      {liveGame.bannedChampions && liveGame.bannedChampions.length > 0 && (
        <div className="glass rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-blue-400 mb-2 text-center">
                {t('profile.blueTeamBans')}
              </div>
              <BansList bans={liveGame.bannedChampions.filter(b => b.teamId === 100)} />
            </div>
            <div>
              <div className="text-sm font-semibold text-red-400 mb-2 text-center">
                {t('profile.redTeamBans')}
              </div>
              <BansList bans={liveGame.bannedChampions.filter(b => b.teamId === 200)} />
            </div>
          </div>
        </div>
      )}

      {/* Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Azul */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="bg-blue-500/20 border-b border-blue-500/30 px-4 py-3">
            <div className="text-blue-400 font-bold flex items-center gap-2">
              <span>🛡️</span>
              <span>{t('profile.blueTeam')}</span>
            </div>
          </div>
          <div className="p-3 space-y-1">
            {blueTeam.map(participant => (
              <ParticipantRow
                key={participant.summonerId}
                participant={participant}
                isCurrentPlayer={participant.puuid === liveGame.currentPlayerPuuid}
              />
            ))}
          </div>
        </div>

        {/* Time Vermelho */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-3">
            <div className="text-red-400 font-bold flex items-center gap-2">
              <span>⚔️</span>
              <span>{t('profile.redTeam')}</span>
            </div>
          </div>
          <div className="p-3 space-y-1">
            {redTeam.map(participant => (
              <ParticipantRow
                key={participant.summonerId}
                participant={participant}
                isCurrentPlayer={participant.puuid === liveGame.currentPlayerPuuid}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-gray-500">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🔄 {t('profile.autoRefresh')}
        </motion.div>
      </div>
    </div>
  )
}

export default LiveMatch
