/**
 * ChampionStats Component - Estatísticas de campeões
 * Mostra campeões mais jogados, maestria, winrate por lane, etc
 */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getLaneName } from '../utils/riotApiUtils'
import { getChampionNameById } from '../utils/ddragonUtils'

function ChampionStats({ matches, championMastery, puuid }) {
  const { t } = useTranslation()
  const version = '14.1.1'

  // Calcular estatísticas das últimas 20 partidas
  const stats = useMemo(() => {
    if (!matches || matches.length === 0) return null

    let totalGames = 0
    let wins = 0
    const championStats = {}
    const laneStats = {}

    matches.forEach(match => {
      if (!match?.info) return
      
      const participant = match.info.participants.find(p => p.puuid === puuid)
      if (!participant) return

      totalGames++
      if (participant.win) wins++

      // Estatísticas por campeão
      const champKey = participant.championName
      if (!championStats[champKey]) {
        championStats[champKey] = { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 }
      }
      championStats[champKey].games++
      if (participant.win) championStats[champKey].wins++
      championStats[champKey].kills += participant.kills
      championStats[champKey].deaths += participant.deaths
      championStats[champKey].assists += participant.assists

      // Estatísticas por lane
      const lane = getLaneName(participant.teamPosition, participant.individualPosition)
      if (!laneStats[lane]) {
        laneStats[lane] = { games: 0, wins: 0 }
      }
      laneStats[lane].games++
      if (participant.win) laneStats[lane].wins++
    })

    // Top 5 campeões mais jogados
    const topChampions = Object.entries(championStats)
      .map(([name, data]) => ({
        name,
        games: data.games,
        wins: data.wins,
        winrate: ((data.wins / data.games) * 100).toFixed(1),
        kda: ((data.kills + data.assists) / (data.deaths || 1)).toFixed(2)
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 5)

    // Estatísticas por lane
    const laneDistribution = Object.entries(laneStats)
      .filter(([lane]) => lane !== 'Fill') // Filtrar lane Fill
      .map(([lane, data]) => ({
        lane,
        games: data.games,
        percentage: ((data.games / totalGames) * 100).toFixed(1),
        wins: data.wins,
        winrate: ((data.wins / data.games) * 100).toFixed(1)
      }))
      .sort((a, b) => b.games - a.games)

    return {
      totalGames,
      wins,
      winrate: ((wins / totalGames) * 100).toFixed(1),
      topChampions,
      laneDistribution
    }
  }, [matches, puuid])

  if (!stats) return null

  return (
    <div className="space-y-4">
      {/* Resumo Geral */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">
          📊 {t('profile.recentStats', 'Estatísticas Recentes')}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-lol-gold">{stats.totalGames}</div>
            <div className="text-sm text-gray-400">{t('profile.totalGames', 'Partidas')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.wins}V</div>
            <div className="text-sm text-gray-400">{t('profile.wins', 'Vitórias')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.winrate}%</div>
            <div className="text-sm text-gray-400">{t('profile.winrate')}</div>
          </div>
        </div>
      </div>

      {/* Top 5 Maestria */}
      {championMastery && championMastery.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-bold gradient-text mb-4">
            ⭐ {t('profile.topMastery', 'Top 5 Maestria')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {championMastery.map((mastery) => {
              const championName = getChampionNameById(mastery.championId)
              return (
                <motion.div
                  key={mastery.championId}
                  className="glass-light rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative inline-block mb-2">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
                      alt={championName}
                      className="w-16 h-16 rounded-lg"
                      onError={(e) => e.target.style.opacity = '0.3'}
                    />
                    <div className="absolute -top-2 -right-2 bg-lol-gold text-lol-dark font-bold text-xs px-2 py-0.5 rounded-full">
                      {mastery.championLevel}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-lol-gold">
                    {mastery.championPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t('profile.points', 'pontos')}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Campeões Mais Jogados */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">
          🎮 {t('profile.mostPlayed', 'Campeões Mais Jogados')} (Últimas 20)
        </h3>
        <div className="space-y-2">
          {stats.topChampions.map((champ, idx) => (
            <div key={champ.name} className="glass-light rounded-lg p-3 flex items-center gap-4">
              <div className="text-lol-gold font-bold text-lg w-6">#{idx + 1}</div>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.name}.png`}
                alt={champ.name}
                className="w-12 h-12 rounded-lg"
                onError={(e) => e.target.style.opacity = '0.3'}
              />
              <div className="flex-1">
                <div className="font-bold">{champ.name}</div>
                <div className="text-sm text-gray-400">
                  {champ.games} {t('profile.games', 'jogos')} • KDA: {champ.kda}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${parseFloat(champ.winrate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {champ.winrate}%
                </div>
                <div className="text-sm text-gray-400">
                  {champ.wins}V {champ.games - champ.wins}D
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição por Lane */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">
          🗺️ {t('profile.laneDistribution', 'Distribuição por Lane')}
        </h3>
        <div className="space-y-2">
          {stats.laneDistribution.map((lane) => (
            <div key={lane.lane} className="glass-light rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">{lane.lane}</div>
                <div className="text-sm">
                  <span className={`font-bold ${parseFloat(lane.winrate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {lane.winrate}%
                  </span>
                  <span className="text-gray-400 ml-2">
                    ({lane.wins}V {lane.games - lane.wins}D)
                  </span>
                </div>
              </div>
              <div className="w-full bg-lol-dark/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lol-gold to-lol-blue"
                  style={{ width: `${lane.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {lane.games} {t('profile.games', 'jogos')} ({lane.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChampionStats
