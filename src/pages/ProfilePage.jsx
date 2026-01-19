/**
 * ProfilePage Component - Página principal de perfil do jogador
 * Integra todos os componentes de perfil
 */
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueEntries,
  getMatchIds,
  getMatchDetails,
  getActiveGame,
  getChampionMastery,
  validateRiotId,
  REGIONS,
  getCachedData,
  setCachedData
} from '../utils/riotApiUtils'
import ProfileHeader from '../components/ProfileHeader'
import MatchHistory from '../components/MatchHistory'
import RankHistory from '../components/RankHistory'
import LiveMatch from '../components/LiveMatch'
import ChampionStats from '../components/ChampionStats'
import LoadingSpinner from '../components/LoadingSpinner'

function ProfilePage() {
  const { t } = useTranslation()
  const { region: urlRegion, riotId: urlRiotId } = useParams()
  const navigate = useNavigate()
  
  const [riotId, setRiotId] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('BR1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('matches') // 'matches', 'rankHistory', 'liveMatch'
  const [searchHistory, setSearchHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  // Dados do jogador
  const [account, setAccount] = useState(null)
  const [summoner, setSummoner] = useState(null)
  const [rankedData, setRankedData] = useState(null)
  const [matches, setMatches] = useState([])
  const [liveGame, setLiveGame] = useState(null)
  const [championMastery, setChampionMastery] = useState([])

  // Carregar histórico de buscas e favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('profileSearchHistory')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading search history:', e)
      }
    }
    
    const savedFavorites = localStorage.getItem('profileFavorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
  }, [])

  // Salvar no histórico
  const saveToHistory = useCallback((riotIdStr, region) => {
    const entry = {
      riotId: riotIdStr,
      region,
      timestamp: Date.now()
    }
    
    setSearchHistory(prev => {
      // Remover duplicatas (mesmo riot ID e região)
      const filtered = prev.filter(item => 
        !(item.riotId === riotIdStr && item.region === region)
      )
      // Adicionar no início e limitar a 10 últimas buscas
      const updated = [entry, ...filtered].slice(0, 10)
      localStorage.setItem('profileSearchHistory', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Toggle favorito
  const toggleFavorite = useCallback((riotIdStr, region) => {
    setFavorites(prev => {
      const isFavorite = prev.some(item => 
        item.riotId === riotIdStr && item.region === region
      )
      
      let updated
      if (isFavorite) {
        // Remover dos favoritos
        updated = prev.filter(item => 
          !(item.riotId === riotIdStr && item.region === region)
        )
      } else {
        // Adicionar aos favoritos
        updated = [...prev, { riotId: riotIdStr, region, timestamp: Date.now() }]
      }
      
      // Salvar no localStorage
      localStorage.setItem('profileFavorites', JSON.stringify(updated))
      
      return updated
    })
  }, [])

  // Verificar se é favorito
  const isFavoriteEntry = useCallback((riotIdStr, region) => {
    return favorites.some(item => 
      item.riotId === riotIdStr && item.region === region
    )
  }, [favorites])

  // Carregar perfil da URL ao montar o componente
  useEffect(() => {
    if (urlRiotId && urlRegion) {
      const decodedRiotId = decodeURIComponent(urlRiotId)
      setRiotId(decodedRiotId)
      setSelectedRegion(urlRegion.toUpperCase())
      
      // Pequeno delay para garantir que os estados foram atualizados
      setTimeout(() => {
        searchPlayerFromUrl(decodedRiotId, urlRegion.toUpperCase())
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Apenas na montagem inicial - não queremos re-executar quando urlRegion/urlRiotId mudarem

  /**
   * Buscar dados do jogador (via URL)
   */
  const searchPlayerFromUrl = useCallback(async (riotIdParam, regionParam) => {
    const validated = validateRiotId(riotIdParam)
    if (!validated) {
      setError(t('profile.invalidRiotId'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const region = REGIONS[regionParam]
      const { gameName, tagLine } = validated

      // 1. Buscar conta
      const accountData = await getAccountByRiotId(gameName, tagLine, region.region)
      setAccount(accountData)

      // 2. Buscar dados do invocador
      const summonerData = await getSummonerByPuuid(accountData.puuid, region.platform)
      summonerData.region = regionParam
      setSummoner(summonerData)

      // 3. Buscar dados de ranked
      const rankedEntries = await getLeagueEntries(accountData.puuid, region.platform)
      setRankedData(rankedEntries)

      // 4. Buscar histórico de partidas
      const matchIds = await getMatchIds(accountData.puuid, region.region, 20)
      const matchPromises = matchIds.map(id => {
        const cached = getCachedData(`match_${id}`)
        if (cached) return Promise.resolve(cached)
        
        return getMatchDetails(id, region.region).then(data => {
          setCachedData(`match_${id}`, data)
          return data
        })
      })
      const matchesData = await Promise.all(matchPromises)
      setMatches(matchesData)

      // 5. Verificar partida ao vivo
      try {
        const liveGameData = await getActiveGame(accountData.puuid, region.platform)
        if (liveGameData) {
          liveGameData.currentPlayerPuuid = accountData.puuid
          setLiveGame(liveGameData)
        } else {
          setLiveGame(null)
        }
      } catch (err) {
        setLiveGame(null)
      }

      // 6. Buscar maestria de campeões
      try {
        const masteryData = await getChampionMastery(accountData.puuid, region.platform, 5)
        setChampionMastery(masteryData)
      } catch (err) {
        console.error('Error fetching mastery:', err)
        setChampionMastery([])
      }

      // Salvar no histórico
      saveToHistory(riotIdParam, regionParam)

    } catch (err) {
      console.error('Error searching player:', err)
      if (err.message.includes('404')) {
        setError(t('profile.notFound'))
      } else if (err.message.includes('429')) {
        setError(t('profile.rateLimitError'))
      } else {
        setError(t('profile.searchError'))
      }
    } finally {
      setLoading(false)
    }
  }, [t, saveToHistory])

  /**
   * Buscar dados do jogador
   */
  const searchPlayer = useCallback(async () => {
    // Validar Riot ID
    const validated = validateRiotId(riotId)
    if (!validated) {
      setError(t('profile.invalidRiotId'))
      return
    }

    // Atualizar URL
    navigate(`/profile/${selectedRegion.toLowerCase()}/${encodeURIComponent(riotId)}`)

    // Buscar perfil
    await searchPlayerFromUrl(riotId, selectedRegion)
  }, [riotId, selectedRegion, navigate, searchPlayerFromUrl, t])

  /**
   * Carregar perfil do histórico
   */
  const loadFromHistory = useCallback((entry) => {
    navigate(`/profile/${entry.region.toLowerCase()}/${encodeURIComponent(entry.riotId)}`)
    setRiotId(entry.riotId)
    setSelectedRegion(entry.region)
    searchPlayerFromUrl(entry.riotId, entry.region)
  }, [navigate, searchPlayerFromUrl])

  /**
   * Auto-refresh para partida ao vivo (30 segundos)
   */
  useEffect(() => {
    if (!summoner || activeTab !== 'liveMatch') return

    const interval = setInterval(async () => {
      try {
        const region = REGIONS[selectedRegion]
        const liveGameData = await getActiveGame(summoner.puuid, region.platform)
        if (liveGameData) {
          liveGameData.currentPlayerPuuid = summoner.puuid
          setLiveGame(liveGameData)
        } else {
          setLiveGame(null)
        }
      } catch (err) {
        setLiveGame(null)
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [summoner, selectedRegion, activeTab])

  /**
   * Renderizar tabs
   */
  const Tab = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 md:flex-none md:px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
        activeTab === id
          ? 'bg-lol-gold text-lol-dark'
          : 'bg-lol-dark/50 text-gray-400 hover:bg-lol-dark/80'
      }`}
    >
      <span className="mr-2">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          {t('profile.title')}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Busca */}
      <div className="glass rounded-xl p-4 md:p-6 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Input Riot ID com Dropdown */}
          <div className="md:col-span-6 relative z-[100]">
            <input
              type="text"
              placeholder={t('profile.placeholder')}
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPlayer()}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lol-gold transition-colors"
            />
            
            {/* Dropdown de Favoritos e Histórico */}
            {showDropdown && (favorites.length > 0 || searchHistory.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-lol-dark border border-lol-gold/30 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                {/* Favoritos */}
                {favorites.length > 0 && (
                  <div className="p-2 border-b border-gray-700">
                    <div className="text-xs font-semibold text-lol-gold mb-2 px-2">
                      ⭐ {t('profile.favorites', 'Favoritos')}
                    </div>
                    {favorites.map((entry, index) => (
                      <div
                        key={`fav-${index}`}
                        className="flex items-center gap-1 hover:bg-lol-gold/10 rounded group"
                      >
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            navigate(`/profile/${entry.region.toLowerCase()}/${encodeURIComponent(entry.riotId)}`)
                            setShowDropdown(false)
                          }}
                          className="flex-1 px-3 py-2 text-left text-sm text-gray-300 hover:text-lol-gold transition-all flex items-center gap-2"
                        >
                          <span className="font-medium">{entry.riotId}</span>
                          <span className="text-xs text-gray-500">({entry.region})</span>
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(entry.riotId, entry.region)
                          }}
                          className="px-2 py-2 text-lol-gold hover:text-red-400 transition-all"
                          title={t('profile.removeFavorite', 'Remover favorito')}
                        >
                          ★
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Histórico Recente */}
                {searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-400 mb-2 px-2">
                      📜 {t('profile.recentSearches', 'Buscas Recentes')}
                    </div>
                    {searchHistory
                      .filter(entry => !isFavoriteEntry(entry.riotId, entry.region))
                      .slice(0, 5)
                      .map((entry, index) => (
                      <div
                        key={`hist-${index}`}
                        className="flex items-center gap-1 hover:bg-lol-gold/10 rounded group"
                      >
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            navigate(`/profile/${entry.region.toLowerCase()}/${encodeURIComponent(entry.riotId)}`)
                            setShowDropdown(false)
                          }}
                          className="flex-1 px-3 py-2 text-left text-sm text-gray-300 hover:text-lol-gold transition-all flex items-center gap-2"
                        >
                          <span>{entry.riotId}</span>
                          <span className="text-xs text-gray-500">({entry.region})</span>
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(entry.riotId, entry.region)
                          }}
                          className={`px-2 py-2 transition-all ${
                            isFavoriteEntry(entry.riotId, entry.region)
                              ? 'text-lol-gold'
                              : 'text-gray-600 hover:text-lol-gold'
                          }`}
                          title={isFavoriteEntry(entry.riotId, entry.region) ? t('profile.removeFavorite', 'Remover favorito') : t('profile.addFavorite', 'Adicionar aos favoritos')}
                        >
                          {isFavoriteEntry(entry.riotId, entry.region) ? '★' : '☆'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Select Região */}
          <div className="md:col-span-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
            >
              {Object.entries(REGIONS).map(([key, region]) => (
                <option key={key} value={key}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de busca */}
          <div className="md:col-span-2">
            <button
              onClick={searchPlayer}
              disabled={loading || !riotId}
              className="w-full bg-lol-gold text-lol-dark font-bold py-3 px-6 rounded-lg hover:bg-lol-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '...' : t('profile.search')}
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Conteúdo do perfil */}
      {!loading && summoner && (
        <>
          {/* Header do perfil */}
          <ProfileHeader 
            summoner={summoner} 
            account={account} 
            rankedData={rankedData}
            isFavorite={account && isFavoriteEntry(account.gameName + '#' + account.tagLine, selectedRegion)}
            onToggleFavorite={account ? () => toggleFavorite(account.gameName + '#' + account.tagLine, selectedRegion) : null}
          />

          {/* Tabs */}
          <div className="glass rounded-xl p-2">
            <div className="flex gap-2">
              <Tab id="matches" label={t('profile.matchHistory')} icon="🎮" />
              <Tab id="stats" label={t('profile.stats')} icon="📊" />
              <Tab id="rankHistory" label={t('profile.rankHistory')} icon="📈" />
              <Tab id="liveMatch" label={t('profile.liveMatch')} icon="🔴" />
            </div>
          </div>

          {/* Conteúdo das tabs */}
          <div>
            {activeTab === 'matches' && (
              <MatchHistory matches={matches} puuid={account?.puuid} />
            )}
            {activeTab === 'stats' && (
              <ChampionStats 
                matches={matches} 
                puuid={account?.puuid} 
                championMastery={championMastery}
              />
            )}
            {activeTab === 'rankHistory' && (
              <RankHistory />
            )}
            {activeTab === 'liveMatch' && (
              <LiveMatch liveGame={liveGame} />
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !summoner && !error && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-bold text-gray-400 mb-2">
            {t('profile.searchPlaceholder')}
          </div>
          <div className="text-sm text-gray-500">
            {t('profile.searchHelp')}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
