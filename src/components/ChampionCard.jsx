/**
 * ChampionCard Component - Card individual para cada campeão
 * Exibe imagem, nome, título, roles e dificuldade
 * ATUALIZADO: Usando imagens locais da database dragontail
 */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function ChampionCard({ champion }) {
  const { t } = useTranslation()
  
  // URL para imagem do campeão (usando CDN da Riot/Data Dragon)
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.image.full}`
  
  // Determinar cor baseada no role principal
  const getRoleColor = (role) => {
    const roleColors = {
      'Fighter': 'from-orange-500 to-red-600',
      'Tank': 'from-green-500 to-emerald-600',
      'Mage': 'from-purple-500 to-indigo-600',
      'Assassin': 'from-red-500 to-pink-600',
      'Marksman': 'from-yellow-500 to-orange-600',
      'Support': 'from-cyan-500 to-blue-600',
    }
    return roleColors[role] || 'from-gray-500 to-gray-600'
  }

  // Calcular estrelas de dificuldade
  const difficultyStars = Array.from({ length: 10 }, (_, i) => i < champion.info.difficulty)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/champion/${champion.id}`}>
        <div className="champion-card group relative bg-lol-dark-secondary rounded-xl overflow-hidden border border-lol-gold/20 hover:border-lol-gold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-lol-gold/20">
          {/* Background gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getRoleColor(champion.tags[0])} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
          
          {/* Champion Image */}
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt={champion.name}
              className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {/* Difficulty badge */}
            <div className="absolute top-3 right-3 glass rounded-lg px-3 py-1 backdrop-blur-md">
              <div className="flex items-center space-x-1">
                {difficultyStars.map((filled, index) => (
                  <svg
                    key={index}
                    className={`w-3 h-3 ${filled ? 'text-lol-gold' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Champion Info */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-lol-gold group-hover:text-white transition-colors">
              {champion.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1 mb-3">{champion.title}</p>

            {/* Tags/Roles */}
            <div className="flex flex-wrap gap-2">
              {champion.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 rounded-full role-${tag.toLowerCase()}-bg border border-current`}
                  style={{ 
                    color: getRoleColor(tag).split(' ')[0].replace('from-', '#'),
                    borderColor: getRoleColor(tag).split(' ')[0].replace('from-', '#') + '40'
                  }}
                >
                  {t(`roles.${tag}`, tag)}
                </span>
              ))}
            </div>

            {/* Stats Preview */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-red-400 font-semibold">{champion.info.attack}</div>
                <div className="text-gray-500">Attack</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold">{champion.info.defense}</div>
                <div className="text-gray-500">Defense</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold">{champion.info.magic}</div>
                <div className="text-gray-500">Magic</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ChampionCard
