/**
 * MatchHistory Component - Histórico de partidas do jogador
 * Exibe últimas 20 partidas com detalhes expandíveis
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { calculateKDA, getTimeAgo, getQueueName, getSummonerSpellName, getLaneName } from '../utils/riotApiUtils'
import { getLatestVersion } from '../utils/ddragonUtils'

function MatchHistory({ matches, puuid }) {
  const { t } = useTranslation()
  const [expandedMatch, setExpandedMatch] = useState(null)
  const [filter, setFilter] = useState({ queue: 'all', result: 'all', champion: 'all', lane: 'all' })
  const [version, setVersion] = useState('14.1.1')

  // Carregar versão do Data Dragon
  useState(() => {
    getLatestVersion().then(setVersion)
  }, [])

  // Filtrar partidas
  const filteredMatches = useMemo(() => {
    if (!matches) return []
    
    return matches.filter(match => {
      if (!match || !match.info) return false
      
      const participant = match.info.participants.find(p => p.puuid === puuid)
      if (!participant) return false

      // Filtro por fila
      if (filter.queue !== 'all' && match.info.queueId !== parseInt(filter.queue)) {
        return false
      }

      // Filtro por resultado
      if (filter.result !== 'all') {
        if (filter.result === 'win' && !participant.win) return false
        if (filter.result === 'loss' && participant.win) return false
      }

      // Filtro por campeão
      if (filter.champion !== 'all' && participant.championName !== filter.champion) {
        return false
      }

      // Filtro por lane
      if (filter.lane !== 'all') {
        const lane = getLaneName(participant.teamPosition, participant.individualPosition)
        if (lane !== filter.lane) return false
      }

      return true
    })
  }, [matches, puuid, filter])

  // Extrair lista única de campeões para o filtro
  const uniqueChampions = useMemo(() => {
    if (!matches) return []
    
    const champions = new Set()
    matches.forEach(match => {
      if (!match || !match.info) return
      const participant = match.info.participants.find(p => p.puuid === puuid)
      if (participant) {
        champions.add(participant.championName)
      }
    })
    
    return Array.from(champions).sort()
  }, [matches, puuid])

  /**
   * Renderizar card de partida
   */
  const MatchCard = ({ match }) => {
    const participant = match.info.participants.find(p => p.puuid === puuid)
    if (!participant) return null

    const isWin = participant.win
    const kda = calculateKDA(participant.kills, participant.deaths, participant.assists)
    const csPerMin = (participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1)
    const isExpanded = expandedMatch === match.metadata.matchId

    // URLs das imagens
    const championImg = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`
    const spell1Img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(participant.summoner1Id)}.png`
    const spell2Img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(participant.summoner2Id)}.png`

    // Itens (6 slots + trinket)
    const items = [
      participant.item0,
      participant.item1,
      participant.item2,
      participant.item3,
      participant.item4,
      participant.item5,
      participant.item6
    ]

    return (
      <motion.div
        layout
        className={`glass rounded-xl overflow-hidden border-l-4 ${
          isWin ? 'border-green-500' : 'border-red-500'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Header da partida */}
        <div
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpandedMatch(isExpanded ? null : match.metadata.matchId)}
        >
          <div className="flex items-center gap-4">
            {/* Campeão */}
            <div className="relative flex-shrink-0">
              <img
                src={championImg}
                alt={participant.championName}
                className="w-16 h-16 rounded-lg"
                onError={(e) => e.target.style.opacity = '0.3'}
              />
              <div className="absolute -bottom-1 -right-1 bg-lol-dark px-1.5 py-0.5 rounded text-xs font-bold">
                {participant.champLevel}
              </div>
            </div>

            {/* Summoner Spells */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <img src={spell1Img} alt="Spell 1" className="w-6 h-6 rounded" onError={(e) => e.target.style.display = 'none'} />
              <img src={spell2Img} alt="Spell 2" className="w-6 h-6 rounded" onError={(e) => e.target.style.display = 'none'} />
            </div>

            {/* KDA e CS */}
            <div className="flex-1 min-w-0">
              <div className={`text-lg font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                {isWin ? t('profile.victory') : t('profile.defeat')}
              </div>
              <div className="text-sm text-gray-300">
                <span className="font-semibold">{participant.kills}</span>
                <span className="text-gray-500"> / </span>
                <span className="font-semibold text-red-400">{participant.deaths}</span>
                <span className="text-gray-500"> / </span>
                <span className="font-semibold">{participant.assists}</span>
                <span className="text-gray-500 ml-2">({kda} KDA)</span>
              </div>
              <div className="text-xs text-gray-400">
                {participant.totalMinionsKilled} CS ({csPerMin}/min)
              </div>
            </div>

            {/* Itens */}
            <div className="hidden md:flex flex-wrap gap-1 w-32">
              {items.map((item, idx) => (
                <div key={idx} className="w-8 h-8 bg-lol-dark/50 rounded overflow-hidden">
                  {item > 0 && (
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`}
                      alt={`Item ${idx}`}
                      className="w-full h-full"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Info adicional */}
            <div className="text-right text-xs text-gray-400 flex-shrink-0">
              <div className="font-semibold text-gray-300">{getQueueName(match.info.queueId)}</div>
              <div>{Math.floor(match.info.gameDuration / 60)}:{String(match.info.gameDuration % 60).padStart(2, '0')}</div>
              <div>{getTimeAgo(match.info.gameEndTimestamp)}</div>
            </div>

            {/* Seta de expandir */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-lol-gold"
            >
              ▼
            </motion.div>
          </div>
        </div>

        {/* Detalhes expandidos */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-700"
            >
              <div className="p-4 space-y-4">
                {/* Stats do jogador */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="glass rounded p-2 text-center">
                    <div className="text-gray-400">{t('profile.damage')}</div>
                    <div className="text-lol-gold font-bold">{participant.totalDamageDealtToChampions.toLocaleString()}</div>
                  </div>
                  <div className="glass rounded p-2 text-center">
                    <div className="text-gray-400">{t('profile.gold')}</div>
                    <div className="text-lol-gold font-bold">{participant.goldEarned.toLocaleString()}</div>
                  </div>
                  <div className="glass rounded p-2 text-center">
                    <div className="text-gray-400">{t('profile.vision')}</div>
                    <div className="text-lol-gold font-bold">{participant.visionScore}</div>
                  </div>
                  <div className="glass rounded p-2 text-center">
                    <div className="text-gray-400">{t('profile.ccTime')}</div>
                    <div className="text-lol-gold font-bold">{Math.floor(participant.timeCCingOthers)}s</div>
                  </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time Azul */}
                  <div className="glass rounded-lg p-3">
                    <div className="text-blue-400 font-bold mb-2 text-sm">
                      {t('profile.blueTeam')}
                    </div>
                    <div className="space-y-1">
                      {match.info.participants
                        .filter(p => p.teamId === 100)
                        .map(p => {
                          const participantLane = getLaneName(p.teamPosition, p.individualPosition)
                          return (
                            <div
                              key={p.puuid}
                              className={`flex items-center gap-2 text-xs ${
                                p.puuid === puuid ? 'bg-lol-gold/20 rounded px-1 py-1' : 'py-1'
                              }`}
                            >
                              {/* Champion e Nome */}
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                <img
                                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`}
                                  alt={p.championName}
                                  className="w-7 h-7 rounded"
                                  onError={(e) => { e.target.style.opacity = '0.3' }}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="truncate text-xs font-medium">{p.summonerName || p.riotIdGameName}</span>
                                  <span className="text-[10px] text-gray-500">{participantLane}</span>
                                </div>
                              </div>
                              
                              {/* Stats principais */}
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-16 text-right">
                                  {p.kills}/{p.deaths}/{p.assists}
                                </span>
                                <span className="text-yellow-500 text-[10px] w-12 text-right">
                                  {(p.goldEarned / 1000).toFixed(1)}k
                                </span>
                                <span className="text-purple-400 text-[10px] w-8 text-right">
                                  Lv{p.champLevel}
                                </span>
                              </div>
                              
                              {/* Itens */}
                              <div className="flex gap-[2px]">
                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6]
                                  .filter(item => item !== 0)
                                  .slice(0, 5)
                                  .map((item, idx) => (
                                    <img
                                      key={idx}
                                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`}
                                      alt={`Item ${item}`}
                                      className="w-4 h-4 rounded border border-gray-700"
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                  ))}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {/* Time Vermelho */}
                  <div className="glass rounded-lg p-3">
                    <div className="text-red-400 font-bold mb-2 text-sm">
                      {t('profile.redTeam')}
                    </div>
                    <div className="space-y-1">
                      {match.info.participants
                        .filter(p => p.teamId === 200)
                        .map(p => {
                          const participantLane = getLaneName(p.teamPosition, p.individualPosition)
                          return (
                            <div
                              key={p.puuid}
                              className={`flex items-center gap-2 text-xs ${
                                p.puuid === puuid ? 'bg-lol-gold/20 rounded px-1 py-1' : 'py-1'
                              }`}
                            >
                              {/* Champion e Nome */}
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                <img
                                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`}
                                  alt={p.championName}
                                  className="w-7 h-7 rounded"
                                  onError={(e) => { e.target.style.opacity = '0.3' }}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="truncate text-xs font-medium">{p.summonerName || p.riotIdGameName}</span>
                                  <span className="text-[10px] text-gray-500">{participantLane}</span>
                                </div>
                              </div>
                              
                              {/* Stats principais */}
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-16 text-right">
                                  {p.kills}/{p.deaths}/{p.assists}
                                </span>
                                <span className="text-yellow-500 text-[10px] w-12 text-right">
                                  {(p.goldEarned / 1000).toFixed(1)}k
                                </span>
                                <span className="text-purple-400 text-[10px] w-8 text-right">
                                  Lv{p.champLevel}
                                </span>
                              </div>
                              
                              {/* Itens */}
                              <div className="flex gap-[2px]">
                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6]
                                  .filter(item => item !== 0)
                                  .slice(0, 5)
                                  .map((item, idx) => (
                                    <img
                                      key={idx}
                                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`}
                                      alt={`Item ${item}`}
                                      className="w-4 h-4 rounded border border-gray-700"
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                  ))}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filter.queue}
            onChange={(e) => setFilter({ ...filter, queue: e.target.value })}
            className="bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-lol-gold"
          >
            <option value="all">{t('profile.allQueues')}</option>
            <option value="420">{t('profile.rankedSolo')}</option>
            <option value="440">{t('profile.rankedFlex')}</option>
            <option value="450">{t('profile.aram')}</option>
          </select>

          <select
            value={filter.result}
            onChange={(e) => setFilter({ ...filter, result: e.target.value })}
            className="bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-lol-gold"
          >
            <option value="all">{t('profile.allResults')}</option>
            <option value="win">{t('profile.wins')}</option>
            <option value="loss">{t('profile.losses')}</option>
          </select>

          <select
            value={filter.champion}
            onChange={(e) => setFilter({ ...filter, champion: e.target.value })}
            className="bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-lol-gold"
          >
            <option value="all">{t('profile.allChampions')}</option>
            {uniqueChampions.map(champion => (
              <option key={champion} value={champion}>{champion}</option>
            ))}
          </select>

          <select
            value={filter.lane}
            onChange={(e) => setFilter({ ...filter, lane: e.target.value })}
            className="bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-lol-gold"
          >
            <option value="all">{t('profile.allLanes')}</option>
            <option value="Top">{t('profile.top')}</option>
            <option value="Jungle">{t('profile.jungle')}</option>
            <option value="Mid">{t('profile.mid')}</option>
            <option value="Bot">{t('profile.bot')}</option>
            <option value="Support">{t('profile.support')}</option>
          </select>
        </div>
      </div>

      {/* Lista de partidas */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredMatches.map(match => (
            <MatchCard key={match.metadata.matchId} match={match} />
          ))}
        </AnimatePresence>

        {filteredMatches.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🎮</div>
            <div className="text-gray-400">{t('profile.noMatches')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchHistory
