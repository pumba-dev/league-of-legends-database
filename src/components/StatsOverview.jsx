/**
 * StatsOverview Component - Overview de estatísticas na home
 */
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

function StatsOverview({ champions }) {
  const { t } = useTranslation()
  
  // Calcula qual curiosidade mostrar baseado no dia do ano
  const dailyFact = useMemo(() => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now - startOfYear
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    // Array de curiosidades (rotaciona baseado no dia)
    const facts = [
      'highestHP',
      'lowestHP',
      'fastestChampion',
      'slowestChampion',
      'highestArmor',
      'highestMR',
      'longestRange',
      'highestAD',
      'lowestAD',
      'mostExpensiveAbility'
    ]
    
    return facts[dayOfYear % facts.length]
  }, [])
  
  const stats = useMemo(() => {
    if (!champions.length) return null

    const roleCount = {}
    let totalDifficulty = 0
    let highestHP = { value: 0, name: '' }
    let lowestHP = { value: Infinity, name: '' }
    let fastestChampion = { value: 0, name: '' }
    let slowestChampion = { value: Infinity, name: '' }
    let highestArmor = { value: 0, name: '' }
    let highestMR = { value: 0, name: '' }
    let longestRange = { value: 0, name: '' }
    let highestDamage = { value: 0, name: '' }
    let lowestDamage = { value: Infinity, name: '' }
    let mostExpensiveAbility = { cost: 0, champion: '', ability: '' }

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

      // Encontrar menor HP
      if (champion.stats.hp < lowestHP.value) {
        lowestHP = { value: champion.stats.hp, name: champion.name }
      }

      // Campeão mais rápido
      if (champion.stats.movespeed > fastestChampion.value) {
        fastestChampion = { value: champion.stats.movespeed, name: champion.name }
      }

      // Campeão mais lento
      if (champion.stats.movespeed < slowestChampion.value) {
        slowestChampion = { value: champion.stats.movespeed, name: champion.name }
      }

      // Maior armadura
      if (champion.stats.armor > highestArmor.value) {
        highestArmor = { value: champion.stats.armor, name: champion.name }
      }

      // Maior resistência mágica
      if (champion.stats.spellblock > highestMR.value) {
        highestMR = { value: champion.stats.spellblock, name: champion.name }
      }

      // Maior alcance
      if (champion.stats.attackrange > longestRange.value) {
        longestRange = { value: champion.stats.attackrange, name: champion.name }
      }

      // Encontrar maior AD
      if (champion.stats.attackdamage > highestDamage.value) {
        highestDamage = { value: champion.stats.attackdamage, name: champion.name }
      }

      // Encontrar menor AD
      if (champion.stats.attackdamage < lowestDamage.value) {
        lowestDamage = { value: champion.stats.attackdamage, name: champion.name }
      }

      // Habilidade mais cara
      if (champion.spells) {
        champion.spells.forEach(spell => {
          if (spell.cost && spell.cost.length > 0) {
            const maxCost = Math.max(...spell.cost)
            if (maxCost > mostExpensiveAbility.cost) {
              mostExpensiveAbility = {
                cost: maxCost,
                champion: champion.name,
                ability: spell.name
              }
            }
          }
        })
      }
    })

    const avgDifficulty = (totalDifficulty / champions.length).toFixed(1)
    const mostCommonRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0]

    return {
      total: champions.length,
      avgDifficulty,
      mostCommonRole: { name: mostCommonRole[0], count: mostCommonRole[1] },
      highestHP,
      lowestHP,
      fastestChampion,
      slowestChampion,
      highestArmor,
      highestMR,
      longestRange,
      highestDamage,
      lowestDamage,
      mostExpensiveAbility,
      roleCount
    }
  }, [champions])

  if (!stats) return null

  // Mapeamento de curiosidades
  const factData = {
    highestHP: {
      icon: '❤️',
      value: stats.highestHP.name,
      label: t('stats.facts.highestHP'),
      detail: `${stats.highestHP.value} HP`,
      color: 'text-red-400'
    },
    lowestHP: {
      icon: '💔',
      value: stats.lowestHP.name,
      label: t('stats.facts.lowestHP'),
      detail: `${stats.lowestHP.value} HP`,
      color: 'text-rose-400'
    },
    fastestChampion: {
      icon: '⚡',
      value: stats.fastestChampion.name,
      label: t('stats.facts.fastestChampion'),
      detail: `${stats.fastestChampion.value} velocidade`,
      color: 'text-yellow-400'
    },
    slowestChampion: {
      icon: '🐌',
      value: stats.slowestChampion.name,
      label: t('stats.facts.slowestChampion'),
      detail: `${stats.slowestChampion.value} velocidade`,
      color: 'text-gray-400'
    },
    highestArmor: {
      icon: '🛡️',
      value: stats.highestArmor.name,
      label: t('stats.facts.highestArmor'),
      detail: `${stats.highestArmor.value} armadura`,
      color: 'text-orange-400'
    },
    highestMR: {
      icon: '✨',
      value: stats.highestMR.name,
      label: t('stats.facts.highestMR'),
      detail: `${stats.highestMR.value} RM`,
      color: 'text-purple-400'
    },
    longestRange: {
      icon: '🎯',
      value: stats.longestRange.name,
      label: t('stats.facts.longestRange'),
      detail: `${stats.longestRange.value} alcance`,
      color: 'text-cyan-400'
    },
    highestAD: {
      icon: '⚔️',
      value: stats.highestDamage.name,
      label: t('stats.facts.highestAD'),
      detail: `${stats.highestDamage.value} AD`,
      color: 'text-red-500'
    },
    lowestAD: {
      icon: '🗡️',
      value: stats.lowestDamage.name,
      label: t('stats.facts.lowestAD'),
      detail: `${stats.lowestDamage.value} AD`,
      color: 'text-gray-500'
    },
    mostExpensiveAbility: {
      icon: '💎',
      value: stats.mostExpensiveAbility.champion,
      label: t('stats.facts.mostExpensiveAbility'),
      detail: `${stats.mostExpensiveAbility.ability} (${stats.mostExpensiveAbility.cost} mana)`,
      color: 'text-blue-400'
    }
  }

  const currentFact = factData[dailyFact]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-lol-gold mb-1">{stats.total}</div>
        <div className="text-sm text-gray-400">{t('stats.totalChampions')}</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-purple-400 mb-1">{stats.avgDifficulty}</div>
        <div className="text-sm text-gray-400">{t('stats.avgDifficulty')}</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-blue-400 mb-1">{stats.mostCommonRole.name}</div>
        <div className="text-sm text-gray-400">{t('stats.mostCommonRole')}</div>
        <div className="text-xs text-gray-500 mt-1">({stats.mostCommonRole.count} {t('stats.champions')})</div>
      </div>

      <div className="glass rounded-xl p-4 text-center relative overflow-hidden group">
        <div className="absolute top-2 right-2 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
          {currentFact.icon}
        </div>
        <div className={`text-2xl font-bold ${currentFact.color} mb-1 truncate`}>
          {currentFact.value}
        </div>
        <div className="text-sm text-gray-400">{currentFact.label}</div>
        <div className="text-xs text-gray-500 mt-1">({currentFact.detail})</div>
        <div className="absolute bottom-1 right-2 text-xs text-lol-gold/50">
          💡 {t('stats.dailyFact')}
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
