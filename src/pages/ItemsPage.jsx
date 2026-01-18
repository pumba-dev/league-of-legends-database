/**
 * ItemsPage Component - Página de listagem de itens
 */
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchItemsList } from '../utils/ddragonUtils'
import ItemCard from '../components/ItemCard'
import LoadingSpinner from '../components/LoadingSpinner'

function ItemsPage() {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [statFilter, setStatFilter] = useState('all')
  const [selectedMap, setSelectedMap] = useState('11') // Summoner's Rift como padrão
  const [sortBy, setSortBy] = useState('price-asc')

  // Carregar itens
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      try {
        const itemsData = await fetchItemsList(i18n.language)
        // Filtrar apenas itens compráveis (que têm preço e não são consumíveis básicos)
        // Remover duplicatas (itens de eventos/modos alternativos com mesmo nome)
        // Remover itens específicos de campeão e itens hidden
        const purchasableItems = itemsData.filter(item => 
          item.gold?.total > 0 && 
          item.gold.purchasable !== false &&
          !item.requiredAlly &&
          !item.requiredChampion &&
          !item.hideFromAll
        )
        
        // Agrupar por nome e manter apenas o item base (geralmente o de menor ID numérico)
        const itemsByName = {}
        purchasableItems.forEach(item => {
          const name = item.name
          if (!itemsByName[name]) {
            itemsByName[name] = item
          } else {
            // Manter o item com menor ID (geralmente é o base)
            const currentId = parseInt(itemsByName[name].id)
            const newId = parseInt(item.id)
            if (newId < currentId) {
              itemsByName[name] = item
            }
          }
        })
        
        setItems(Object.values(itemsByName))
      } catch (error) {
        console.error('Erro ao carregar itens:', error)
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [i18n.language])

  // Extrair tags únicas
  const allTags = useMemo(() => {
    const tags = new Set()
    items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [items])

  // Curiosidade do dia sobre itens
  const dailyCuriosity = useMemo(() => {
    const curiosities = [
      {
        title: t('items.curiosities.1.title', 'Item Mais Antigo'),
        description: t('items.curiosities.1.desc', 'O primeiro item do League of Legends foi a "Doran\'s Blade", introduzida no lançamento do jogo em 2009.')
      },
      {
        title: t('items.curiosities.2.title', 'Item Mais Caro'),
        description: t('items.curiosities.2.desc', 'O item mais caro da história foi o "Trinity Force" com 3733 de gold, mas foi rebalanceado várias vezes.')
      },
      {
        title: t('items.curiosities.3.title', 'Item Mais Popular'),
        description: t('items.curiosities.3.desc', 'O "Infinity Edge" é um dos itens mais comprados em ranked, dando 80% de chance de crítico.')
      },
      {
        title: t('items.curiosities.4.title', 'Item Mais Único'),
        description: t('items.curiosities.4.desc', 'O "Zhonya\'s Hourglass" permite ficar intangível por 2.5 segundos, um dos poucos itens com esse efeito.')
      },
      {
        title: t('items.curiosities.5.title', 'Item Mais Poderoso'),
        description: t('items.curiosities.5.desc', 'O "Rabadon\'s Deathcap" dá o maior AP do jogo com 120 de poder de habilidade.')
      },
      {
        title: t('items.curiosities.6.title', 'Item Mais Barato'),
        description: t('items.curiosities.6.desc', 'Os itens mais baratos custam apenas 400 gold, como "Amplifying Tome" ou "Cloth Armor".')
      },
      {
        title: t('items.curiosities.7.title', 'Item Mais Vendido'),
        description: t('items.curiosities.7.desc', 'O "Health Potion" é o item mais vendido em todas as partidas, custando apenas 50 gold.')
      },
      {
        title: t('items.curiosities.8.title', 'Item Mais Raro'),
        description: t('items.curiosities.8.desc', 'Itens míticos são os mais raros e poderosos, como "Kraken Slayer" ou "Galeforce".')
      },
      {
        title: t('items.curiosities.9.title', 'Item Mais Antigo Ativo'),
        description: t('items.curiosities.9.desc', 'O "Boots of Speed" existe desde o beta e ainda é usado em todas as builds.')
      },
      {
        title: t('items.curiosities.10.title', 'Item Mais Caro Atual'),
        description: t('items.curiosities.10.desc', 'Atualmente, itens míticos custam 3300 gold, sendo os mais caros disponíveis.')
      }
    ]

    // Selecionar curiosidade baseada no dia do ano
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const curiosityIndex = dayOfYear % curiosities.length

    return curiosities[curiosityIndex]
  }, [t])

  // Contar filtros ativos
  const activeFiltersCount = [
    searchTerm,
    selectedTag !== 'all',
    priceRange !== 'all',
    statFilter !== 'all',
    selectedMap !== 'all'
  ].filter(Boolean).length

  // Helper function to check if item has specific stat type
  const hasStatType = (item, statType) => {
    if (!item.stats) return false
    
    switch (statType) {
      case 'hasAD':
        return (item.stats.FlatPhysicalDamageMod || 0) > 0
      case 'hasAP':
        return (item.stats.FlatMagicDamageMod || 0) > 0
      case 'hasArmor':
        return (item.stats.FlatArmorMod || 0) > 0
      case 'hasMR':
        return (item.stats.FlatSpellBlockMod || 0) > 0
      case 'hasHealth':
        return (item.stats.FlatHPPoolMod || 0) > 0
      case 'hasMana':
        return (item.stats.FlatMPPoolMod || 0) > 0
      case 'hasAS':
        return (item.stats.PercentAttackSpeedMod || 0) > 0
      case 'hasCrit':
        return (item.stats.FlatCritChanceMod || 0) > 0
      case 'hasLifeSteal':
        return (item.stats.PercentLifeStealMod || 0) > 0
      default:
        return false
    }
  }

  // Filtrar e ordenar itens
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Filtro de busca
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plaintext?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro de tag
      const matchesTag = selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag))
      
      // Filtro de preço
      let matchesPrice = true
      if (priceRange !== 'all') {
        const price = item.gold?.total || 0
        if (priceRange === 'cheap') matchesPrice = price < 1000
        else if (priceRange === 'medium') matchesPrice = price >= 1000 && price < 2500
        else if (priceRange === 'expensive') matchesPrice = price >= 2500
      }

      // Filtro de stats
      const matchesStat = statFilter === 'all' || hasStatType(item, statFilter)

      // Filtro de mapa
      const matchesMap = selectedMap === 'all' || (item.maps && item.maps[selectedMap] === true)
      
      return matchesSearch && matchesTag && matchesPrice && matchesStat && matchesMap
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name)
        case 'name-desc': return b.name.localeCompare(a.name)
        case 'price-asc': return (a.gold?.total || 0) - (b.gold?.total || 0)
        case 'price-desc': return (b.gold?.total || 0) - (a.gold?.total || 0)
        case 'ad-asc': return (a.stats?.FlatPhysicalDamageMod || 0) - (b.stats?.FlatPhysicalDamageMod || 0)
        case 'ad-desc': return (b.stats?.FlatPhysicalDamageMod || 0) - (a.stats?.FlatPhysicalDamageMod || 0)
        case 'ap-asc': return (a.stats?.FlatMagicDamageMod || 0) - (b.stats?.FlatMagicDamageMod || 0)
        case 'ap-desc': return (b.stats?.FlatMagicDamageMod || 0) - (a.stats?.FlatMagicDamageMod || 0)
        case 'armor-asc': return (a.stats?.FlatArmorMod || 0) - (b.stats?.FlatArmorMod || 0)
        case 'armor-desc': return (b.stats?.FlatArmorMod || 0) - (a.stats?.FlatArmorMod || 0)
        case 'mr-asc': return (a.stats?.FlatSpellBlockMod || 0) - (b.stats?.FlatSpellBlockMod || 0)
        case 'mr-desc': return (b.stats?.FlatSpellBlockMod || 0) - (a.stats?.FlatSpellBlockMod || 0)
        case 'health-asc': return (a.stats?.FlatHPPoolMod || 0) - (b.stats?.FlatHPPoolMod || 0)
        case 'health-desc': return (b.stats?.FlatHPPoolMod || 0) - (a.stats?.FlatHPPoolMod || 0)
        case 'mana-asc': return (a.stats?.FlatMPPoolMod || 0) - (b.stats?.FlatMPPoolMod || 0)
        case 'mana-desc': return (b.stats?.FlatMPPoolMod || 0) - (a.stats?.FlatMPPoolMod || 0)
        case 'as-asc': return (a.stats?.PercentAttackSpeedMod || 0) - (b.stats?.PercentAttackSpeedMod || 0)
        case 'as-desc': return (b.stats?.PercentAttackSpeedMod || 0) - (a.stats?.PercentAttackSpeedMod || 0)
        case 'crit-asc': return (a.stats?.FlatCritChanceMod || 0) - (b.stats?.FlatCritChanceMod || 0)
        case 'crit-desc': return (b.stats?.FlatCritChanceMod || 0) - (a.stats?.FlatCritChanceMod || 0)
        case 'lifesteal-asc': return (a.stats?.PercentLifeStealMod || 0) - (b.stats?.PercentLifeStealMod || 0)
        case 'lifesteal-desc': return (b.stats?.PercentLifeStealMod || 0) - (a.stats?.PercentLifeStealMod || 0)
        case 'movespeed-asc': return (a.stats?.FlatMovementSpeedMod || 0) - (b.stats?.FlatMovementSpeedMod || 0)
        case 'movespeed-desc': return (b.stats?.FlatMovementSpeedMod || 0) - (a.stats?.FlatMovementSpeedMod || 0)
        default: return 0
      }
    })

    return filtered
  }, [items, searchTerm, selectedTag, priceRange, statFilter, selectedMap, sortBy])

  // Estatísticas baseadas nos itens filtrados
  const stats = useMemo(() => {
    if (filteredItems.length === 0) return null

    const totalItems = filteredItems.length
    const avgPrice = Math.round(filteredItems.reduce((sum, item) => sum + (item.gold?.total || 0), 0) / totalItems)
    const mostExpensive = filteredItems.reduce((max, item) => 
      (item.gold?.total || 0) > (max.gold?.total || 0) ? item : max
    , filteredItems[0])
    const cheapest = filteredItems.filter(i => (i.gold?.total || 0) > 0)
      .reduce((min, item) => 
        (item.gold?.total || 0) < (min.gold?.total || 0) ? item : min
      , filteredItems.find(i => (i.gold?.total || 0) > 0) || filteredItems[0])

    return { totalItems, avgPrice, mostExpensive, cheapest }
  }, [filteredItems])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          {t('items.title', 'Itens do League of Legends')}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {t('items.subtitle', 'Explore todos os itens disponíveis no jogo')}
        </p>
      </div>

      {/* Stats Overview */}
      {stats && dailyCuriosity && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="glass rounded-xl p-3 md:p-4 flex flex-col items-center justify-center">
            <div className="text-2xl md:text-3xl font-bold text-lol-gold mb-1">{stats.totalItems}</div>
            <div className="text-xs md:text-sm text-gray-400 text-center">{t('items.totalItems', 'Total de Itens')}</div>
          </div>
          <div className="glass rounded-xl p-3 md:p-4 flex flex-col items-center justify-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">{stats.avgPrice}</div>
            <div className="text-xs md:text-sm text-gray-400 text-center">{t('items.avgPrice', 'Preço Médio')}</div>
          </div>
          <div className="glass rounded-xl p-3 md:p-4 flex flex-col items-center justify-center">
            <div className="text-base md:text-lg font-bold text-green-400 mb-1 md:mb-2 text-center">{stats.cheapest.name}</div>
            <div className="text-xs md:text-sm text-gray-400 mb-1">{t('items.cheapest', 'Mais Barato')}</div>
            <div className="text-xs text-gray-500">{stats.cheapest.gold?.total}{t('items.goldUnit', 'G')}</div>
          </div>
          <div className="glass rounded-xl p-3 md:p-4 flex flex-col items-center justify-center">
            <div className="text-base md:text-lg font-bold text-purple-400 mb-1 md:mb-2 text-center">{stats.mostExpensive.name}</div>
            <div className="text-xs md:text-sm text-gray-400 mb-1">{t('items.mostExpensive', 'Mais Caro')}</div>
            <div className="text-xs text-gray-500">{stats.mostExpensive.gold?.total}{t('items.goldUnit', 'G')}</div>
          </div>
          <div className="glass rounded-xl p-3 md:p-4 text-center relative group flex flex-col col-span-2 md:col-span-1">
            <div className="absolute top-2 right-2 text-xl md:text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
              🎯
            </div>
            <div className="text-base md:text-lg font-bold text-lol-gold mb-2 px-4 md:px-6">
              {dailyCuriosity.title}
            </div>
            <div className="text-xs text-gray-400 px-2 mb-2 flex-1 flex items-center justify-center leading-relaxed">
              {dailyCuriosity.description}
            </div>
            <div className="absolute bottom-1 right-2 text-xs text-lol-gold/50">
              💡 {t('items.dailyFact', 'Curiosidade do Dia')}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass rounded-xl p-4 md:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('items.search', 'Buscar itens...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-lol-gold transition-colors"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {activeFiltersCount > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="px-2 py-1 bg-lol-gold text-lol-dark rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            </div>
          )}
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {/* Sort */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">
              🔄 {t('items.sortBy', 'Ordenar')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              <option value="name-asc">{t('items.nameAsc', 'Nome (A-Z)')}</option>
              <option value="name-desc">{t('items.nameDesc', 'Nome (Z-A)')}</option>
              <option value="price-asc">{t('items.priceAsc', 'Preço (Menor)')}</option>
              <option value="price-desc">{t('items.priceDesc', 'Preço (Maior)')}</option>
              <option value="ad-asc">{t('items.adAsc', 'AD (Menor)')}</option>
              <option value="ad-desc">{t('items.adDesc', 'AD (Maior)')}</option>
              <option value="ap-asc">{t('items.apAsc', 'AP (Menor)')}</option>
              <option value="ap-desc">{t('items.apDesc', 'AP (Maior)')}</option>
              <option value="armor-asc">{t('items.armorAsc', 'Armadura (Menor)')}</option>
              <option value="armor-desc">{t('items.armorDesc', 'Armadura (Maior)')}</option>
              <option value="mr-asc">{t('items.mrAsc', 'MR (Menor)')}</option>
              <option value="mr-desc">{t('items.mrDesc', 'MR (Maior)')}</option>
              <option value="health-asc">{t('items.healthAsc', 'Vida (Menor)')}</option>
              <option value="health-desc">{t('items.healthDesc', 'Vida (Maior)')}</option>
              <option value="mana-asc">{t('items.manaAsc', 'Mana (Menor)')}</option>
              <option value="mana-desc">{t('items.manaDesc', 'Mana (Maior)')}</option>
              <option value="as-asc">{t('items.asAsc', 'Vel. Ataque (Menor)')}</option>
              <option value="as-desc">{t('items.asDesc', 'Vel. Ataque (Maior)')}</option>
              <option value="crit-asc">{t('items.critAsc', 'Crítico (Menor)')}</option>
              <option value="crit-desc">{t('items.critDesc', 'Crítico (Maior)')}</option>
              <option value="lifesteal-asc">{t('items.lifestealAsc', 'Roubo Vida (Menor)')}</option>
              <option value="lifesteal-desc">{t('items.lifestealDesc', 'Roubo Vida (Maior)')}</option>
              <option value="movespeed-asc">{t('items.movespeedAsc', 'Vel. Mov. (Menor)')}</option>
              <option value="movespeed-desc">{t('items.movespeedDesc', 'Vel. Mov. (Maior)')}</option>
            </select>
          </div>

          {/* Map Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              🗺️ {t('items.map', 'Mapa')}
            </label>
            <select
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              <option value="all">{t('items.allMaps', 'Todos')}</option>
              <option value="11">{t('maps.11', "Summoner's Rift")}</option>
              <option value="12">{t('maps.12', 'ARAM')}</option>
              <option value="21">{t('maps.21', 'Nexus Blitz')}</option>
              <option value="30">{t('maps.30', 'Arena')}</option>
              <option value="33">{t('maps.33', 'Swiftplay')}</option>
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              🏷️ {t('items.category', 'Categoria')}
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              <option value="all">{t('items.allCategories', 'Todas')}</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{t(`itemTags.${tag}`, tag)}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              💰 {t('items.priceRange', 'Faixa de Preço')}
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              <option value="all">{t('items.allPrices', 'Todos')}</option>
              <option value="cheap">{t('items.cheap', '< 1000G')}</option>
              <option value="medium">{t('items.medium', '1000-2500G')}</option>
              <option value="expensive">{t('items.expensive', '> 2500G')}</option>
            </select>
          </div>

          {/* Stats Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              📊 {t('items.filterByStats', 'Filtrar por Stats')}
            </label>
            <select
              value={statFilter}
              onChange={(e) => setStatFilter(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              <option value="all">{t('items.allStats', 'Todos')}</option>
              <option value="hasAD">{t('items.hasAD', 'Dano de Ataque')}</option>
              <option value="hasAP">{t('items.hasAP', 'Poder de Habilidade')}</option>
              <option value="hasArmor">{t('items.hasArmor', 'Armadura')}</option>
              <option value="hasMR">{t('items.hasMR', 'Resistência Mágica')}</option>
              <option value="hasHealth">{t('items.hasHealth', 'Vida')}</option>
              <option value="hasMana">{t('items.hasMana', 'Mana')}</option>
              <option value="hasAS">{t('items.hasAS', 'Velocidade de Ataque')}</option>
              <option value="hasCrit">{t('items.hasCrit', 'Chance de Crítico')}</option>
              <option value="hasLifeSteal">{t('items.hasLifeSteal', 'Roubo de Vida')}</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-lol-gold/20">
            <span className="text-sm text-gray-400 font-semibold">{t('filter.activeFilters', 'Filtros ativos:')}</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-lol-gold/20 text-lol-gold rounded-full text-sm flex items-center">
                🔍 &ldquo;{searchTerm}&rdquo;
              </span>
            )}
            {selectedTag !== 'all' && (
              <span className="px-3 py-1 bg-lol-blue/20 text-lol-blue rounded-full text-sm">
                🏷️ {t(`itemTags.${selectedTag}`, selectedTag)}
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                💰 {priceRange === 'cheap' ? t('items.cheap', '< 1000G') : priceRange === 'medium' ? t('items.medium', '1000-2500G') : t('items.expensive', '> 2500G')}
              </span>
            )}
            {statFilter !== 'all' && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                📊 {statFilter === 'hasAD' ? t('items.hasAD', 'Dano de Ataque') : 
                    statFilter === 'hasAP' ? t('items.hasAP', 'Poder de Habilidade') :
                    statFilter === 'hasArmor' ? t('items.hasArmor', 'Armadura') :
                    statFilter === 'hasMR' ? t('items.hasMR', 'Resistência Mágica') :
                    statFilter === 'hasHealth' ? t('items.hasHealth', 'Vida') :
                    statFilter === 'hasMana' ? t('items.hasMana', 'Mana') :
                    statFilter === 'hasAS' ? t('items.hasAS', 'Velocidade de Ataque') :
                    statFilter === 'hasCrit' ? t('items.hasCrit', 'Chance de Crítico') :
                    t('items.hasLifeSteal', 'Roubo de Vida')}
              </span>
            )}
            {selectedMap !== 'all' && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                🗺️ {selectedMap === '11' ? t('maps.11', "Summoner's Rift") : 
                    selectedMap === '12' ? t('maps.12', 'ARAM') :
                    selectedMap === '21' ? t('maps.21', 'Nexus Blitz') :
                    selectedMap === '30' ? t('maps.30', 'Arena') :
                    t('maps.33', 'Swiftplay')}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTag('all')
                setPriceRange('all')
                setStatFilter('all')
                setSelectedMap('11')
                setSortBy('price-asc')
              }}
              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition-colors flex items-center"
            >
              ❌ {t('filter.clearAll', 'Limpar todos')}
            </button>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {filteredItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onTagClick={(tag) => setSelectedTag(tag)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">{t('items.noResults', 'Nenhum item encontrado')}</p>
        </div>
      )}
    </div>
  )
}

export default ItemsPage
