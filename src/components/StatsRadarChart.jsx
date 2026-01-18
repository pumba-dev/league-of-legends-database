/**
 * StatsRadarChart Component - Gráfico radar para estatísticas do campeão
 */
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

function StatsRadarChart({ info }) {
  const data = [
    { attribute: 'Ataque', value: info.attack, fullMark: 10 },
    { attribute: 'Defesa', value: info.defense, fullMark: 10 },
    { attribute: 'Magia', value: info.magic, fullMark: 10 },
    { attribute: 'Dificuldade', value: info.difficulty, fullMark: 10 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#C89B3C" strokeOpacity={0.3} />
        <PolarAngleAxis 
          dataKey="attribute" 
          tick={{ fill: '#F0E6D2', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          tick={{ fill: '#5B5A56' }}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#C89B3C"
          fill="#C89B3C"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E2328',
            border: '1px solid #C89B3C',
            borderRadius: '8px',
            color: '#F0E6D2'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default StatsRadarChart
