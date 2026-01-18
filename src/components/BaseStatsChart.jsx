/**
 * BaseStatsChart Component - Gráfico de barras para estatísticas base
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function BaseStatsChart({ stats }) {
  const data = [
    { name: 'HP', value: stats.hp, color: '#10B981' },
    { name: 'MP', value: stats.mp, color: '#3B82F6' },
    { name: 'Armor', value: stats.armor, color: '#F59E0B' },
    { name: 'MR', value: stats.spellblock, color: '#8B5CF6' },
    { name: 'AD', value: stats.attackdamage, color: '#EF4444' },
    { name: 'Speed', value: stats.movespeed, color: '#06B6D4' },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2C3137" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#F0E6D2', fontSize: 12 }}
          stroke="#C89B3C"
        />
        <YAxis 
          tick={{ fill: '#5B5A56', fontSize: 12 }}
          stroke="#C89B3C"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E2328',
            border: '1px solid #C89B3C',
            borderRadius: '8px',
            color: '#F0E6D2'
          }}
        />
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
