/**
 * StatsRadarChart Component - Gráfico radar para estatísticas do campeão
 */
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'

function StatsRadarChart({ info }) {
  const { t } = useTranslation()
  
  const data = [
    { 
      attribute: t('radarStats.attack'), 
      value: info.attack, 
      fullMark: 10,
      description: t('radarStats.attackDesc')
    },
    { 
      attribute: t('radarStats.defense'), 
      value: info.defense, 
      fullMark: 10,
      description: t('radarStats.defenseDesc')
    },
    { 
      attribute: t('radarStats.magic'), 
      value: info.magic, 
      fullMark: 10,
      description: t('radarStats.magicDesc')
    },
    { 
      attribute: t('radarStats.difficulty'), 
      value: info.difficulty, 
      fullMark: 10,
      description: t('radarStats.difficultyDesc')
    },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: '#0A1428',
          border: '2px solid #C89B3C',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          maxWidth: '220px'
        }}>
          <p style={{ 
            color: '#F0E6D2', 
            fontWeight: 'bold', 
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {data.attribute}
          </p>
          <p style={{ 
            color: '#C89B3C', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginBottom: '6px'
          }}>
            {data.value}/10
          </p>
          <p style={{ 
            color: '#A09B8C', 
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            {data.description}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#C89B3C" strokeOpacity={0.3} />
        <PolarAngleAxis 
          dataKey="attribute" 
          tick={{ fill: '#F0E6D2', fontSize: 13, fontWeight: 500 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#C89B3C"
          fill="#C89B3C"
          fillOpacity={0.6}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default StatsRadarChart
