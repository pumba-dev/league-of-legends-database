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
    <div>
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
              <div 
                className="absolute top-1 right-1 w-3 h-3 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)',
                  backgroundSize: '200% 200%',
                  animation: 'chromaGradient 3s ease infinite, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  boxShadow: '0 0 8px rgba(255, 0, 128, 0.6)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)'
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SkinsGallery
