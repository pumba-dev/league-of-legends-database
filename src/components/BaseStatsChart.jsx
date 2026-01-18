/**
 * BaseStatsChart Component - Gráfico de barras para estatísticas base
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTranslation } from 'react-i18next'

function BaseStatsChart({ stats }) {
  const { t } = useTranslation()
  
  const data = [
    { 
      name: 'HP', 
      value: stats.hp, 
      color: '#10B981',
      fullName: t('chartStats.hp'),
      description: t('chartStats.hpDesc')
    },
    { 
      name: 'MP', 
      value: stats.mp, 
      color: '#3B82F6',
      fullName: t('chartStats.mp'),
      description: t('chartStats.mpDesc')
    },
    { 
      name: 'Armor', 
      value: stats.armor, 
      color: '#F59E0B',
      fullName: t('chartStats.armor'),
      description: t('chartStats.armorDesc')
    },
    { 
      name: 'MR', 
      value: stats.spellblock, 
      color: '#8B5CF6',
      fullName: t('chartStats.mr'),
      description: t('chartStats.mrDesc')
    },
    { 
      name: 'AD', 
      value: stats.attackdamage, 
      color: '#EF4444',
      fullName: t('chartStats.ad'),
      description: t('chartStats.adDesc')
    },
    { 
      name: 'Speed', 
      value: stats.movespeed, 
      color: '#06B6D4',
      fullName: t('chartStats.speed'),
      description: t('chartStats.speedDesc')
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
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <p style={{ 
            color: '#F0E6D2', 
            fontWeight: 'bold', 
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {data.fullName}
          </p>
          <p style={{ 
            color: data.color, 
            fontSize: '18px', 
            fontWeight: 'bold',
            marginBottom: '6px'
          }}>
            {data.value.toFixed(0)}
          </p>
          <p style={{ 
            color: '#A09B8C', 
            fontSize: '12px',
            lineHeight: '1.4',
            maxWidth: '200px'
          }}>
            {data.description}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2C3137" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#F0E6D2', fontSize: 12 }}
          stroke="#C89B3C"
          tickFormatter={(value) => {
            const item = data.find(d => d.name === value)
            return item ? item.fullName : value
          }}
        />
        <YAxis 
          tick={{ fill: '#A09B8C', fontSize: 12 }}
          stroke="#C89B3C"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BaseStatsChart
