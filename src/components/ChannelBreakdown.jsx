import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { channelBreakdown, DEFAULT_SEGMENT } from '../lib/data'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value?.toFixed(2)}</div>
      ))}
    </div>
  )
}

export default function ChannelBreakdown() {
  const data = channelBreakdown(DEFAULT_SEGMENT)
  return (
    <div className="card">
      <div className="chart-title">ROAS por canal — UFBRA · SP · ADM</div>
      <div className="chart-subtitle">Média até 19/07 vs. 20/07, um canal ao lado do outro. Barras praticamente idênticas nos três canais.</div>
      <div style={{ width: '100%', height: 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={6}>
            <CartesianGrid stroke="#e1e0d9" vertical={false} />
            <XAxis dataKey="canal" tick={{ fontSize: 11, fill: '#898781' }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#898781' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'antes' ? 'Média até 19/07' : '20/07')} />
            <Bar dataKey="antes" name="antes" fill="#B9C2D6" radius={[3, 3, 0, 0]} maxBarSize={48} />
            <Bar dataKey="dia20" name="dia20" fill="#C1443B" radius={[3, 3, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
