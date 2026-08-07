import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts'
import { overall, fmtPct } from '../lib/data'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const v = payload[0].value
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>Margem de lucro</div>
      <div style={{ color: v < 0 ? 'var(--alert)' : 'var(--ink)' }}>{fmtPct(v)}</div>
    </div>
  )
}

export default function MarginTrend() {
  const data = overall.map((d) => ({ ...d, label: d.date.slice(8, 10) + '/07' }))
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#2A2538" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8F99B2' }} axisLine={{ stroke: '#3A3548' }} tickLine={false} />
          <YAxis
            tickFormatter={(v) => fmtPct(v, 0)}
            tick={{ fontSize: 10, fill: '#8F99B2' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0} stroke="#3A3548" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="margin" radius={[3, 3, 0, 0]} maxBarSize={26}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.date === '2024-07-20' ? '#F2664F' : '#B7C4E5'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
