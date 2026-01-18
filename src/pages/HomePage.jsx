/**
 * HomePage Component - Página inicial com lista de campeões
 * Inclui filtros, busca e scroll infinito
 * ATUALIZADO: Usando database completa do dragontail com 172 campeões
 */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import ChampionCard from '../components/ChampionCard'
import FilterBar from '../components/FilterBar'
import SkeletonCard from '../components/SkeletonCard'
import StatsOverview from '../components/StatsOverview'

function HomePage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [champions, setChampions] = useState([])
  const [filters, setFilters] = useState({ 
    searchTerm: '', 
    role: 'all', 
    difficulty: 'all',
    resource: 'all',
    range: 'all'
  })
  const [displayCount, setDisplayCount] = useState(20) // Scroll infinito: começar com 20
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Carregar dados dos campeões da nova database consolidada
  useEffect(() => {
    const loadChampions = async () => {
      setLoading(true)
      try {
        const response = await fetch('/champions-full.json')
        const championsArray = await response.json()
        setChampions(championsArray)
      } catch (error) {
        console.error('Erro ao carregar campeões:', error)
      } finally {
        setTimeout(() => setLoading(false), 500) // Simular carregamento
      }
    }

    loadChampions()
  }, [])

  // Extrair todas as tags únicas para o filtro
  const allTags = useMemo(() => {
    const tags = new Set()
    champions.forEach(champion => {
      champion.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [champions])

  // Extrair todos os tipos de recursos únicos
  const allResourceTypes = useMemo(() => {
    const resources = new Set()
    champions.forEach(champion => {
      if (champion.partype) {
        resources.add(champion.partype)
      }
    })
    return Array.from(resources).sort()
  }, [champions])

  // Filtrar campeões
  const filteredChampions = useMemo(() => {
    return champions.filter(champion => {
      // Filtro por nome
      const matchesSearch = champion.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           champion.title.toLowerCase().includes(filters.searchTerm.toLowerCase())

      // Filtro por role
      const matchesRole = filters.role === 'all' || champion.tags.includes(filters.role)

      // Filtro por dificuldade
      let matchesDifficulty = true
      if (filters.difficulty !== 'all') {
        const difficulty = champion.info.difficulty
        if (filters.difficulty === '1-3') {
          matchesDifficulty = difficulty >= 1 && difficulty <= 3
        } else if (filters.difficulty === '4-6') {
          matchesDifficulty = difficulty >= 4 && difficulty <= 6
        } else if (filters.difficulty === '7-10') {
          matchesDifficulty = difficulty >= 7 && difficulty <= 10
        }
      }

      // Filtro por tipo de recurso
      const matchesResource = filters.resource === 'all' || champion.partype === filters.resource

      // Filtro por alcance de ataque
      let matchesRange = true
      if (filters.range !== 'all') {
        const attackrange = parseInt(champion.stats.attackrange)
        if (filters.range === 'melee') {
          matchesRange = attackrange < 200
        } else if (filters.range === 'short') {
          matchesRange = attackrange >= 200 && attackrange < 400
        } else if (filters.range === 'medium') {
          matchesRange = attackrange >= 400 && attackrange <= 550
        } else if (filters.range === 'long') {
          matchesRange = attackrange > 550
        }
      }

      return matchesSearch && matchesRole && matchesDifficulty && matchesResource && matchesRange
    })
  }, [champions, filters])

  // Campeões a serem exibidos (para scroll infinito)
  const displayedChampions = useMemo(() => {
    return filteredChampions.slice(0, displayCount)
  }, [filteredChampions, displayCount])

  // Callback para mudança de filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setDisplayCount(20) // Reset ao mudar filtros
  }, [])

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      // Verificar se está perto do final da página
      const scrollPosition = window.innerHeight + window.scrollY
      const threshold = document.documentElement.scrollHeight - 500

      if (scrollPosition >= threshold && !isLoadingMore && displayCount < filteredChampions.length) {
        setIsLoadingMore(true)
        
        // Simular delay de carregamento
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 20, filteredChampions.length))
          setIsLoadingMore(false)
        }, 500)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [displayCount, filteredChampions.length, isLoadingMore])

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
          {t('home.title')}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {t('home.subtitle', { count: champions.length })}
        </p>
      </div>

      {/* Stats Overview */}
      {!loading && <StatsOverview champions={champions} />}

      {/* Filter Bar */}
      <FilterBar 
        onFilterChange={handleFilterChange} 
        allTags={allTags}
        allResourceTypes={allResourceTypes}
      />

      {/* Results Count */}
      <div className="mb-6 text-gray-400">
        <span dangerouslySetInnerHTML={{ __html: t('home.showing', { displayed: displayedChampions.length, total: filteredChampions.length }).replace(/<1>/g, '<span class="text-lol-gold font-semibold">').replace(/<\/1>/g, '</span>').replace(/<3>/g, '<span class="text-lol-gold font-semibold">').replace(/<\/3>/g, '</span>') }} />
      </div>

      {/* Champions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredChampions.length === 0 ? (
        // Empty State
        <div className="text-center py-20">
          <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-500 mb-2">{t('home.noResults')}</h3>
          <p className="text-gray-600">{t('home.tryAdjusting')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedChampions.map((champion) => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
          </div>

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2 text-lol-gold">
                <div className="w-8 h-8 border-4 border-lol-gold border-t-transparent rounded-full animate-spin" />
                <span>{t('home.loadingMore')}</span>
              </div>
            </div>
          )}

          {/* End of List Message */}
          {displayCount >= filteredChampions.length && filteredChampions.length > 20 && (
            <div className="mt-8 text-center text-gray-500">
              <p>{t('home.endOfList')}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage
