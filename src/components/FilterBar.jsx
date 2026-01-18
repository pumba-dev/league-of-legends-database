/**
 * FilterBar Component - Barra de filtros e busca MELHORADA
 * Filtros: nome, role, dificuldade, tipo de recurso, alcance
 */
import { useState, useEffect } from 'react'

function FilterBar({ onFilterChange, allTags, allResourceTypes }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedResource, setSelectedResource] = useState('all')
  const [selectedRange, setSelectedRange] = useState('all')

  useEffect(() => {
    onFilterChange({
      searchTerm,
      role: selectedRole,
      difficulty: selectedDifficulty,
      resource: selectedResource,
      range: selectedRange
    })
  }, [searchTerm, selectedRole, selectedDifficulty, selectedResource, selectedRange, onFilterChange])

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
          placeholder="Buscar campeão por nome ou título..."
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            🎯 Role / Classe
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">Todas as Roles</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            ⭐ Dificuldade
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">Todas</option>
            <option value="1-3">Fácil (1-3)</option>
            <option value="4-6">Médio (4-6)</option>
            <option value="7-10">Difícil (7-10)</option>
          </select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            💎 Tipo de Recurso
          </label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">Todos</option>
            {allResourceTypes.map((resource) => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>
        </div>

        {/* Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            📏 Alcance de Ataque
          </label>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-lol-dark border border-lol-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lol-gold transition-colors cursor-pointer"
          >
            <option value="all">Todos</option>
            <option value="melee">Corpo a Corpo (&lt; 200)</option>
            <option value="short">Curto (200-400)</option>
            <option value="medium">Médio (400-550)</option>
            <option value="long">Longo (&gt; 550)</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-lol-gold/20">
          <span className="text-sm text-gray-400 font-semibold">Filtros ativos:</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-lol-gold/20 text-lol-gold rounded-full text-sm flex items-center">
              🔍 "{searchTerm}"
            </span>
          )}
          {selectedRole !== 'all' && (
            <span className="px-3 py-1 bg-lol-blue/20 text-lol-blue rounded-full text-sm">
              🎯 {selectedRole}
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              ⭐ {selectedDifficulty}
            </span>
          )}
          {selectedResource !== 'all' && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              💎 {selectedResource}
            </span>
          )}
          {selectedRange !== 'all' && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              📏 {selectedRange === 'melee' ? 'Corpo a Corpo' : selectedRange === 'short' ? 'Curto' : selectedRange === 'medium' ? 'Médio' : 'Longo'}
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedRole('all')
              setSelectedDifficulty('all')
              setSelectedResource('all')
              setSelectedRange('all')
            }}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition-colors flex items-center"
          >
            ❌ Limpar todos
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterBar
