/**
 * AbilityCard Component - Card para exibir uma habilidade do campeão
 */
function AbilityCard({ ability, type }) {
  // URL base para imagens de habilidades
  const abilityImageUrl = `/database/dragontail-16.1.1/16.1.1/img/spell/${ability.image.full}`;
  
  // Cores por tipo de habilidade
  const abilityColors = {
    passive: 'from-yellow-500 to-orange-600',
    Q: 'from-blue-500 to-cyan-600',
    W: 'from-purple-500 to-pink-600',
    E: 'from-green-500 to-emerald-600',
    R: 'from-red-500 to-rose-600'
  };

  const bgColor = abilityColors[type] || 'from-gray-500 to-gray-600';

  return (
    <div className="glass rounded-xl p-4 hover:border-lol-gold transition-all duration-300">
      {/* Header com ícone e nome */}
      <div className="flex items-start space-x-4 mb-3">
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br ${bgColor} p-1`}>
          <img
            src={abilityImageUrl}
            alt={ability.name}
            className="w-full h-full rounded-lg"
            onError={(e) => {
              e.target.src = 'https://ddragon.leagueoflegends.com/cdn/16.1.1/img/spell/' + ability.image.full;
            }}
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-lol-gold rounded-full flex items-center justify-center text-xs font-bold text-lol-dark">
            {type}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-lg text-white mb-1">{ability.name}</h4>
          <p className="text-xs text-gray-400">{ability.id}</p>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-sm text-gray-300 mb-3 leading-relaxed">
        {ability.description}
      </p>

      {/* Stats da habilidade */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {ability.cooldown && ability.cooldown.length > 0 && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Cooldown</div>
            <div className="text-cyan-400 font-semibold">{ability.cooldownBurn}s</div>
          </div>
        )}
        
        {ability.cost && ability.cost.length > 0 && ability.cost[0] > 0 && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Custo</div>
            <div className="text-blue-400 font-semibold">{ability.costBurn}</div>
          </div>
        )}
        
        {ability.range && ability.range.length > 0 && ability.range[0] < 25000 && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Alcance</div>
            <div className="text-green-400 font-semibold">{ability.rangeBurn}</div>
          </div>
        )}
        
        {ability.maxrank && (
          <div className="bg-lol-dark-secondary/50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Nível Máximo</div>
            <div className="text-purple-400 font-semibold">{ability.maxrank}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AbilityCard
