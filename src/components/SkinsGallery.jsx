/**
 * SkinsGallery Component - Galeria de skins do campeão
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SkinsGallery({ championId, skins }) {
  const [selectedSkin, setSelectedSkin] = useState(0)

  // URL base para splash arts
  const getSplashUrl = (skinNum) => {
    return `/database/dragontail-16.1.1/img/champion/splash/${championId}_${skinNum}.jpg`
  }

  // Skin selecionada
  const currentSkin = skins[selectedSkin]

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold text-lol-gold mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        Skins ({skins.length})
      </h2>

      {/* Splash Art Principal */}
      <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-lol-dark-secondary">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedSkin}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            src={getSplashUrl(currentSkin.num)}
            alt={currentSkin.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${currentSkin.num}.jpg`;
            }}
          />
        </AnimatePresence>
        
        {/* Nome da Skin */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-lol-dark via-lol-dark/80 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{currentSkin.name}</h3>
          {currentSkin.chromas && (
            <span className="inline-block mt-2 px-3 py-1 bg-lol-gold/20 text-lol-gold rounded-full text-sm">
              ✨ Possui Chromas
            </span>
          )}
        </div>
      </div>

      {/* Miniaturas de Skins */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {skins.map((skin, index) => (
          <button
            key={skin.id}
            onClick={() => setSelectedSkin(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedSkin === index
                ? 'border-lol-gold scale-110 shadow-lg shadow-lol-gold/50'
                : 'border-lol-gold/20 hover:border-lol-gold/60 hover:scale-105'
            }`}
          >
            <img
              src={getSplashUrl(skin.num)}
              alt={skin.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skin.num}.jpg`;
              }}
            />
            
            {/* Indicador de Chromas */}
            {skin.chromas && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-lol-gold rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SkinsGallery
