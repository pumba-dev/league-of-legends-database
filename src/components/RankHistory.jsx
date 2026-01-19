/**
 * RankHistory Component - Histórico de elos por season
 * Gráfico mostrando progressão de elo com toggle entre elo final e pico
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getTierColor } from '../utils/riotApiUtils'

function RankHistory() {
  const { t } = useTranslation()
  const [mode, setMode] = useState('final') // 'final' ou 'peak'
  const [queueType, setQueueType] = useState('solo') // 'solo' ou 'flex'

  // Dados mockados (API da Riot não fornece histórico completo)
  // Em produção, você pode integrar com APIs de terceiros como OP.GG
  const mockData = useMemo(() => ({
    solo: {
      seasons: [
        { 
          season: 'S2024', 
          final: { tier: 'GOLD', rank: 'II', lp: 45, wins: 156, losses: 142 },
          peak: { tier: 'PLATINUM', rank: 'IV', lp: 12, wins: 142, losses: 128 }
        },
        { 
          season: 'S2023', 
          final: { tier: 'SILVER', rank: 'I', lp: 78, wins: 189, losses: 172 },
          peak: { tier: 'GOLD', rank: 'III', lp: 23, wins: 165, losses: 145 }
        },
        { 
          season: 'S2022', 
          final: { tier: 'SILVER', rank: 'III', lp: 34, wins: 201, losses: 195 },
          peak: { tier: 'SILVER', rank: 'II', lp: 67, wins: 178, losses: 162 }
        },
        { 
          season: 'S2021', 
          final: { tier: 'BRONZE', rank: 'I', lp: 89, wins: 143, losses: 138 },
          peak: { tier: 'SILVER', rank: 'IV', lp: 5, wins: 125, losses: 115 }
        }
      ]
    },
    flex: {
      seasons: [
        { 
          season: 'S2024', 
          final: { tier: 'SILVER', rank: 'III', lp: 56, wins: 87, losses: 79 },
          peak: { tier: 'GOLD', rank: 'IV', lp: 0, wins: 72, losses: 65 }
        },
        { 
          season: 'S2023', 
          final: { tier: 'BRONZE', rank: 'I', lp: 45, wins: 95, losses: 88 },
          peak: { tier: 'SILVER', rank: 'III', lp: 34, wins: 82, losses: 75 }
        }
      ]
    }
  }), [])

  // Dados atuais baseados no tipo de fila e modo
  const currentData = mockData[queueType]?.seasons || []

  // Mapeamento de tier para valor numérico (para o gráfico)
  const tierToValue = {
    'IRON': 1,
    'BRONZE': 2,
    'SILVER': 3,
    'GOLD': 4,
    'PLATINUM': 5,
    'EMERALD': 6,
    'DIAMOND': 7,
    'MASTER': 8,
    'GRANDMASTER': 9,
    'CHALLENGER': 10
  }

  const rankToValue = {
    'IV': 0.25,
    'III': 0.5,
    'II': 0.75,
    'I': 1
  }

  /**
   * Calcular posição do ponto no gráfico
   */
  const getPointPosition = (tierData, index, total) => {
    if (!tierData) return { x: 0, y: 0 }
    
    const tierValue = tierToValue[tierData.tier] || 0
    const rankValue = rankToValue[tierData.rank] || 0
    const totalValue = tierValue + rankValue

    // Normalizar para 0-100
    const x = (index / (total - 1)) * 100
    const y = 100 - ((totalValue / 11) * 100) // Inverter Y (0 no topo)

    return { x, y }
  }

  /**
   * Renderizar linha do gráfico
   */
  const renderGraph = () => {
    const data = mode === 'final' 
      ? currentData.map(s => s.final) 
      : currentData.map(s => s.peak)

    if (data.length < 2) return null

    // Criar pontos
    const points = data.map((tierData, index) => 
      getPointPosition(tierData, index, data.length)
    )

    // Criar linha SVG
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ')

    return (
      <svg className="w-full h-64" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid horizontal */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(200, 170, 110, 0.1)"
            strokeWidth="0.2"
          />
        ))}

        {/* Gradiente de fundo */}
        <defs>
          <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={getTierColor(data[data.length - 1]?.tier)} stopOpacity="0.2" />
            <stop offset="100%" stopColor={getTierColor(data[data.length - 1]?.tier)} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Área sob a linha */}
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#rankGradient)"
        />

        {/* Linha principal */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={getTierColor(data[data.length - 1]?.tier)}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Pontos */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={getTierColor(data[index]?.tier)}
              stroke="white"
              strokeWidth="0.3"
            />
          </g>
        ))}
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Toggle Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('final')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                mode === 'final'
                  ? 'bg-lol-gold text-lol-dark'
                  : 'bg-lol-dark/50 text-gray-400 hover:bg-lol-dark/80'
              }`}
            >
              {t('profile.currentElo')}
            </button>
            <button
              onClick={() => setMode('peak')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                mode === 'peak'
                  ? 'bg-lol-gold text-lol-dark'
                  : 'bg-lol-dark/50 text-gray-400 hover:bg-lol-dark/80'
              }`}
            >
              {t('profile.peakElo')}
            </button>
          </div>

          {/* Toggle Queue */}
          <div className="flex gap-2">
            <button
              onClick={() => setQueueType('solo')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                queueType === 'solo'
                  ? 'bg-blue-500 text-white'
                  : 'bg-lol-dark/50 text-gray-400 hover:bg-lol-dark/80'
              }`}
            >
              {t('profile.soloQueue')}
            </button>
            <button
              onClick={() => setQueueType('flex')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                queueType === 'flex'
                  ? 'bg-purple-500 text-white'
                  : 'bg-lol-dark/50 text-gray-400 hover:bg-lol-dark/80'
              }`}
            >
              {t('profile.flexQueue')}
            </button>
          </div>
        </div>
      </div>

      {/* Aviso de dados mockados */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
        <span className="font-semibold">⚠️ {t('profile.mockDataWarning')}:</span>{' '}
        {t('profile.mockDataDescription')}
      </div>

      {/* Gráfico */}
      <div className="glass rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-lol-gold mb-2">
            {t('profile.rankProgressio n')}
          </h3>
          <p className="text-sm text-gray-400">
            {mode === 'final' ? t('profile.finalRankBySession') : t('profile.peakRankBySeason')}
          </p>
        </div>

        {/* Gráfico */}
        <div className="relative">
          {renderGraph()}

          {/* Labels de seasons */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {currentData.map((season, index) => (
              <div key={index} className="text-center">
                {season.season}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detalhes por season */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {currentData.map((season, index) => {
          const tierData = mode === 'final' ? season.final : season.peak
          const winrate = ((tierData.wins / (tierData.wins + tierData.losses)) * 100).toFixed(1)

          return (
            <motion.div
              key={index}
              className="glass rounded-xl p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xs font-semibold text-gray-400 mb-2">
                {season.season}
              </div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: getTierColor(tierData.tier) }}
              >
                {tierData.tier} {tierData.rank}
              </div>
              <div className="text-lol-gold text-sm mb-2">
                {tierData.lp} LP
              </div>
              <div className="text-xs text-gray-400">
                {tierData.wins}V / {tierData.losses}D
              </div>
              <div className="text-xs text-gray-400">
                {winrate}% WR
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default RankHistory
