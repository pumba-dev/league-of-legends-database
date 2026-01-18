/**
 * StatsOverview Component - Overview de estatísticas na home
 */
import { useMemo } from 'react'

function StatsOverview({ champions }) {
  const stats = useMemo(() => {
    if (!champions.length) return null

    const roleCount = {}
    let totalDifficulty = 0
    let highestHP = { value: 0, name: '' }
    let highestDamage = { value: 0, name: '' }

    champions.forEach(champion => {
      // Contar roles
      champion.tags.forEach(tag => {
        roleCount[tag] = (roleCount[tag] || 0) + 1
      })

      // Calcular dificuldade média
      totalDifficulty += champion.info.difficulty

      // Encontrar maior HP
      if (champion.stats.hp > highestHP.value) {
        highestHP = { value: champion.stats.hp, name: champion.name }
      }

      // Encontrar maior AD
      if (champion.stats.attackdamage > highestDamage.value) {
        highestDamage = { value: champion.stats.attackdamage, name: champion.name }
      }
    })

    const avgDifficulty = (totalDifficulty / champions.length).toFixed(1)
    const mostCommonRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0]

    return {
      total: champions.length,
      avgDifficulty,
      mostCommonRole: { name: mostCommonRole[0], count: mostCommonRole[1] },
      highestHP,
      highestDamage,
      roleCount
    }
  }, [champions])

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-lol-gold mb-1">{stats.total}</div>
        <div className="text-sm text-gray-400">Total de Campeões</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-purple-400 mb-1">{stats.avgDifficulty}</div>
        <div className="text-sm text-gray-400">Dificuldade Média</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-blue-400 mb-1">{stats.mostCommonRole.name}</div>
        <div className="text-sm text-gray-400">Role Mais Comum</div>
        <div className="text-xs text-gray-500 mt-1">({stats.mostCommonRole.count} campeões)</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-green-400 mb-1">{stats.highestHP.name}</div>
        <div className="text-sm text-gray-400">Maior HP Base</div>
        <div className="text-xs text-gray-500 mt-1">({stats.highestHP.value} HP)</div>
      </div>
    </div>
  )
}

export default StatsOverview
