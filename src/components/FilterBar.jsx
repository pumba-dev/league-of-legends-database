/**
 * FilterBar Component - Barra de filtros e busca MELHORADA
 * Filtros: nome, role, dificuldade, tipo de recurso, alcance
 */
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function FilterBar({ onFilterChange, allTags, allResourceTypes }) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedResource, setSelectedResource] = useState('all')
  const [selectedRange, setSelectedRange] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  useEffect(() => {
    onFilterChange({
      searchTerm,
      role: selectedRole,
      difficulty: selectedDifficulty,
      resource: selectedResource,
      range: selectedRange,
      sortBy
    })
  }, [searchTerm, selectedRole, selectedDifficulty, selectedResource, selectedRange, sortBy, onFilterChange])

  const activeFiltersCount = [
    searchTerm,
    selectedRole !== 'all',
    selectedDifficulty !== 'all',
    selectedResource !== 'all',
    selectedRange !== 'all'
  ].filter(Boolean).length

  return (
    <div className="glass rounded-xl p-6 mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('filter.search')}
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

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            🔄 {t('filter.sortBy')}
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="name-asc">{t('filter.nameAsc')}</option>
            <option value="name-desc">{t('filter.nameDesc')}</option>
            <option value="difficulty-asc">{t('filter.difficultyAsc')}</option>
            <option value="difficulty-desc">{t('filter.difficultyDesc')}</option>
            <option value="hp-desc">{t('filter.hpDesc')}</option>
            <option value="hp-asc">{t('filter.hpAsc')}</option>
            <option value="attack-desc">{t('filter.attackDesc')}</option>
            <option value="attack-asc">{t('filter.attackAsc')}</option>
            <option value="defense-desc">{t('filter.defenseDesc')}</option>
            <option value="defense-asc">{t('filter.defenseAsc')}</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            🎯 {t('filter.role')}
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">{t('filter.allRoles')}</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {t(`roles.${tag}`, tag)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            ⭐ {t('filter.difficulty')}
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">{t('filter.allDifficulties')}</option>
            <option value="1-3">{t('filter.easy')}</option>
            <option value="4-6">{t('filter.medium')}</option>
            <option value="7-10">{t('filter.hard')}</option>
          </select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            💎 {t('filter.resource')}
          </label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">{t('filter.allResources')}</option>
            {allResourceTypes.map((resource) => (
              <option key={resource} value={resource}>
                {t(`resources.${resource}`, resource)}
              </option>
            ))}
          </select>
        </div>

        {/* Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            📏 {t('filter.range')}
          </label>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">{t('filter.allRanges')}</option>
            <option value="melee">{t('filter.melee')}</option>
            <option value="short">{t('filter.short')}</option>
            <option value="medium">{t('filter.mediumRange')}</option>
            <option value="long">{t('filter.long')}</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-lol-gold/20">
          <span className="text-sm text-gray-400 font-semibold">{t('filter.activeFilters')}</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-lol-gold/20 text-lol-gold rounded-full text-sm flex items-center">
              🔍 "{searchTerm}"
            </span>
          )}
          {selectedRole !== 'all' && (
            <span className="px-3 py-1 bg-lol-blue/20 text-lol-blue rounded-full text-sm">
              🎯 {t(`roles.${selectedRole}`, selectedRole)}
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              ⭐ {selectedDifficulty === '1-3' ? t('filter.easy') : selectedDifficulty === '4-6' ? t('filter.medium') : t('filter.hard')}
            </span>
          )}
          {selectedResource !== 'all' && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              💎 {t(`resources.${selectedResource}`, selectedResource)}
            </span>
          )}
          {selectedRange !== 'all' && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              📏 {selectedRange === 'melee' ? t('filter.melee').split(' (')[0] : selectedRange === 'short' ? t('filter.short').split(' (')[0] : selectedRange === 'medium' ? t('filter.mediumRange').split(' (')[0] : t('filter.long').split(' (')[0]}
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedRole('all')
              setSelectedDifficulty('all')
              setSelectedResource('all')
              setSelectedRange('all')
              setSortBy('name-asc')
            }}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition-colors flex items-center"
          >
            ❌ {t('filter.clearAll')}
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterBar
