/**
 * MatchHistory Component - Histórico de partidas do jogador
 * Exibe últimas 20 partidas com detalhes expandíveis
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { calculateKDA, getTimeAgo, getQueueName, getSummonerSpellName, getLaneName } from '../utils/riotApiUtils'
import { getLatestVersion, normalizeChampionName, getChampionNameById } from '../utils/ddragonUtils'

function MatchHistory({ matches, puuid, region }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
    const championImg = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizeChampionName(participant.championName)}.png`
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
              <img src={spell1Img} alt="Spell 1" className="w-6 h-6 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
              <img src={spell2Img} alt="Spell 2" className="w-6 h-6 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
            </div>

            {/* KDA e CS */}
            <div className="flex-1 min-w-0">
              <div className={`text-lg font-bold ${
                participant.gameEndedInEarlySurrender ? 'text-orange-400' : 
                isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {participant.gameEndedInEarlySurrender ? t('profile.remake', 'Remake') : 
                 isWin ? t('profile.victory') : t('profile.defeat')}
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
            <div className="hidden md:flex gap-1">
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
              <div>{getTimeAgo(match.info.gameEndTimestamp, t)}</div>
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
                    <div className="text-gray-400">{t('profile.deadTime')}</div>
                    <div className="text-lol-gold font-bold">
                      {Math.floor(participant.totalTimeSpentDead / 60)}m {participant.totalTimeSpentDead % 60}s
                      <span className="text-[10px] text-gray-400 ml-1">
                        ({((participant.totalTimeSpentDead / match.info.gameDuration) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bans e Objectives */}
                <div className={`grid grid-cols-1 gap-4 ${
                  match.info.teams?.some(team => team.bans?.some(ban => ban.championId !== -1)) ? 'md:grid-cols-2' : ''
                }`}>
                  {/* Bans - só mostrar se houver bans */}
                  {match.info.teams && match.info.teams.length > 0 && match.info.teams.some(team => team.bans?.some(ban => ban.championId !== -1)) && (
                    <div className="glass rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-400 mb-3">{t('profile.bans', 'Bans')}</div>
                      <div className="space-y-3">
                        {match.info.teams.map(team => (
                          <div key={team.teamId} className="space-y-1">
                            <div className={`text-xs font-semibold ${
                              team.teamId === 100 ? 'text-blue-400' : 'text-red-400'
                            }`}>
                              {team.teamId === 100 ? t('profile.blueTeam') : t('profile.redTeam')}
                            </div>
                            <div className="flex gap-1.5">
                              {team.bans?.slice(0, 5).map((ban, idx) => (
                                ban.championId !== -1 ? (
                                  <img
                                    key={idx}
                                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${getChampionNameById(ban.championId)}.png`}
                                    alt="Ban"
                                    className="w-7 h-7 rounded opacity-70 hover:opacity-100 transition-opacity"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                  />
                                ) : <div key={idx} className="w-7 h-7 bg-gray-800 rounded" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Objectives - mostrar apenas os que têm pelo menos 1 */}
                  {match.info.teams && match.info.teams.length > 0 && match.info.teams.some(team => 
                    (team.objectives?.dragon?.kills || 0) > 0 || 
                    (team.objectives?.baron?.kills || 0) > 0 || 
                    (team.objectives?.tower?.kills || 0) > 0 ||
                    (team.objectives?.inhibitor?.kills || 0) > 0 ||
                    (team.objectives?.riftHerald?.kills || 0) > 0
                  ) && (
                    <div className="glass rounded-lg p-4">
                      <div className="text-xs font-semibold text-gray-400 mb-3">{t('profile.objectives', 'Objetivos')}</div>
                      <div className="space-y-3">
                        {match.info.teams.map(team => {
                          const objectives = [];
                          if ((team.objectives?.dragon?.kills || 0) > 0) objectives.push({ label: t('profile.dragons'), value: team.objectives.dragon.kills });
                          if ((team.objectives?.baron?.kills || 0) > 0) objectives.push({ label: t('profile.barons'), value: team.objectives.baron.kills });
                          if ((team.objectives?.tower?.kills || 0) > 0) objectives.push({ label: t('profile.towers'), value: team.objectives.tower.kills });
                          if ((team.objectives?.inhibitor?.kills || 0) > 0) objectives.push({ label: t('profile.inhibitors'), value: team.objectives.inhibitor.kills });
                          if ((team.objectives?.riftHerald?.kills || 0) > 0) objectives.push({ label: t('profile.heralds'), value: team.objectives.riftHerald.kills });
                          
                          return objectives.length > 0 ? (
                            <div key={team.teamId} className="space-y-1">
                              <div className={`text-xs font-semibold ${team.teamId === 100 ? 'text-blue-400' : 'text-red-400'}`}>
                                {team.teamId === 100 ? t('profile.blueTeam') : t('profile.redTeam')}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {objectives.map((obj, idx) => (
                                  <div key={idx} className="bg-lol-dark/50 rounded px-2 py-1 text-xs">
                                    <span className="text-gray-400">{obj.label}:</span>
                                    <span className="text-lol-gold font-semibold ml-1">{obj.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time Azul */}
                  <div className="glass rounded-lg p-3">
                    <div className="text-blue-400 font-bold mb-2 text-sm flex items-center gap-2 flex-wrap">
                      <span>{t('profile.blueTeam')}</span>
                      {match.info.teams?.find(t => t.teamId === 100)?.objectives?.champion?.first && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-normal">{t('profile.firstBlood')}</span>
                      )}
                      {match.info.teams?.find(t => t.teamId === 100)?.objectives?.tower?.first && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-normal">{t('profile.firstTower')}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {match.info.participants
                        .filter(p => p.teamId === 100)
                        .map(p => {
                          const participantLane = getLaneName(p.teamPosition, p.individualPosition)
                          const pSpell1 = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(p.summoner1Id)}.png`
                          const pSpell2 = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(p.summoner2Id)}.png`
                          return (
                            <div
                              key={p.puuid}
                              className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-white/5 transition-colors ${
                                p.puuid === puuid ? 'bg-lol-gold/20 rounded px-2' : 'rounded px-2'
                              }`}
                              onClick={() => {
                                if (p.riotIdGameName && p.riotIdTagline) {
                                  navigate(`/profile/${region.toLowerCase()}/${encodeURIComponent(p.riotIdGameName + '#' + p.riotIdTagline)}`)
                                }
                              }}
                            >
                              {/* Champion */}
                              <div className="flex items-center gap-1">
                                <div className="relative">
                                  <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizeChampionName(p.championName)}.png`}
                                    alt={p.championName}
                                    className="w-8 h-8 rounded"
                                    onError={(e) => { e.target.style.opacity = '0.3' }}
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-lol-dark text-[9px] px-1 rounded font-bold text-lol-gold">
                                    {p.champLevel}
                                  </div>
                                </div>
                                {/* Spells */}
                                <div className="flex flex-col gap-[2px]">
                                  <img src={pSpell1} alt="Spell" className="w-4 h-4 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
                                  <img src={pSpell2} alt="Spell" className="w-4 h-4 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
                                </div>
                              </div>
                              
                              {/* Nome e Lane */}
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="truncate text-xs font-medium">
                                    {p.riotIdGameName || p.summonerName}
                                    {p.riotIdTagline && <span className="text-gray-500">#{p.riotIdTagline}</span>}
                                  </span>
                                  <span className="text-[9px] px-1 py-0.5 bg-lol-gold/20 text-lol-gold rounded">Lv{p.summonerLevel}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                  {participantLane && participantLane !== 'Fill' && (
                                    <span className="text-gray-500">{participantLane}</span>
                                  )}
                                  {participantLane && participantLane !== 'Fill' && <span className="text-gray-600">•</span>}
                                  <span>{p.totalMinionsKilled + p.neutralMinionsKilled} CS</span>
                                </div>
                              </div>
                              
                              {/* KDA */}
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">
                                  {p.kills}<span className="text-gray-500">/</span>{p.deaths}<span className="text-gray-500">/</span>{p.assists}
                                </span>
                                <span className="text-[10px] text-lol-gold">
                                  {p.deaths === 0 ? t('profile.perfect') : ((p.kills + p.assists) / p.deaths).toFixed(2)} KDA
                                </span>
                              </div>
                              
                              {/* Itens (7 slots) */}
                              <div className="flex gap-[3px]">
                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((item, idx) => (
                                  <div key={idx} className="w-6 h-6 bg-gray-800/50 rounded border border-gray-700/50">
                                    {item > 0 && (
                                      <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`}
                                        alt={`Item ${item}`}
                                        className="w-full h-full rounded"
                                        onError={(e) => { e.target.style.opacity = '0.3' }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {/* Time Vermelho */}
                  <div className="glass rounded-lg p-3">
                    <div className="text-red-400 font-bold mb-2 text-sm flex items-center gap-2 flex-wrap">
                      <span>{t('profile.redTeam')}</span>
                      {match.info.teams?.find(t => t.teamId === 200)?.objectives?.champion?.first && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-normal">{t('profile.firstBlood')}</span>
                      )}
                      {match.info.teams?.find(t => t.teamId === 200)?.objectives?.tower?.first && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-normal">{t('profile.firstTower')}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {match.info.participants
                        .filter(p => p.teamId === 200)
                        .map(p => {
                          const participantLane = getLaneName(p.teamPosition, p.individualPosition)
                          const pSpell1 = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(p.summoner1Id)}.png`
                          const pSpell2 = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${getSummonerSpellName(p.summoner2Id)}.png`
                          return (
                            <div
                              key={p.puuid}
                              className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-white/5 transition-colors ${
                                p.puuid === puuid ? 'bg-lol-gold/20 rounded px-2' : 'rounded px-2'
                              }`}
                              onClick={() => {
                                if (p.riotIdGameName && p.riotIdTagline) {
                                  navigate(`/profile/${region.toLowerCase()}/${encodeURIComponent(p.riotIdGameName + '#' + p.riotIdTagline)}`)
                                }
                              }}
                            >
                              {/* Champion */}
                              <div className="flex items-center gap-1">
                                <div className="relative">
                                  <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${normalizeChampionName(p.championName)}.png`}
                                    alt={p.championName}
                                    className="w-8 h-8 rounded"
                                    onError={(e) => { e.target.style.opacity = '0.3' }}
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-lol-dark text-[9px] px-1 rounded font-bold text-lol-gold">
                                    {p.champLevel}
                                  </div>
                                </div>
                                {/* Spells */}
                                <div className="flex flex-col gap-[2px]">
                                  <img src={pSpell1} alt="Spell" className="w-4 h-4 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
                                  <img src={pSpell2} alt="Spell" className="w-4 h-4 rounded" onError={(e) => { e.target.style.opacity = '0.3' }} />
                                </div>
                              </div>
                              
                              {/* Nome e Lane */}
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="truncate text-xs font-medium">
                                    {p.riotIdGameName || p.summonerName}
                                    {p.riotIdTagline && <span className="text-gray-500">#{p.riotIdTagline}</span>}
                                  </span>
                                  <span className="text-[9px] px-1 py-0.5 bg-lol-gold/20 text-lol-gold rounded">Lv{p.summonerLevel}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                  {participantLane && participantLane !== 'Fill' && (
                                    <span className="text-gray-500">{participantLane}</span>
                                  )}
                                  {participantLane && participantLane !== 'Fill' && <span className="text-gray-600">•</span>}
                                  <span>{p.totalMinionsKilled + p.neutralMinionsKilled} CS</span>
                                </div>
                              </div>
                              
                              {/* KDA */}
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">
                                  {p.kills}<span className="text-gray-500">/</span>{p.deaths}<span className="text-gray-500">/</span>{p.assists}
                                </span>
                                <span className="text-[10px] text-lol-gold">
                                  {p.deaths === 0 ? t('profile.perfect') : ((p.kills + p.assists) / p.deaths).toFixed(2)} KDA
                                </span>
                              </div>
                              
                              {/* Itens (7 slots) */}
                              <div className="flex gap-[3px]">
                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((item, idx) => (
                                  <div key={idx} className="w-6 h-6 bg-gray-800/50 rounded border border-gray-700/50">
                                    {item > 0 && (
                                      <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`}
                                        alt={`Item ${item}`}
                                        className="w-full h-full rounded"
                                        onError={(e) => { e.target.style.opacity = '0.3' }}
                                      />
                                    )}
                                  </div>
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
