import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { segmentVsRestFunnel, fmtPct, DEFAULT_SEGMENT } from '../lib/data'

const STAGES = [
  { key: 'atc', label: 'Add to Cart\n(tráfego → carrinho)' },
  { key: 'ccvr', label: 'Checkout CVR\n(carrinho → compra)' },
  { key: 'cvr', label: 'CVR geral\n(tráfego → venda)' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 170, whiteSpace: 'pre-line' }}>
      <div style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'antes' ? 'Média até 19/07' : '20/07'}: {fmtPct(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function FunnelChart() {
  const f = segmentVsRestFunnel(DEFAULT_SEGMENT)
  const data = STAGES.map((s) => ({
    stage: s.label,
    antes: f[s.key].segBefore,
    dia20: f[s.key].segDay,
  }))

  return (
    <div className="card">
      <div className="chart-title">Taxas de conversão por etapa · UFBRA · SP · ADM</div>
      <div className="chart-subtitle">Add to Cart despenca; Checkout CVR (a etapa seguinte, de pagamento) fica praticamente igual.</div>
      <div style={{ width: '100%', height: 280, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 20 }} barGap={6}>
            <CartesianGrid stroke="#e1e0d9" vertical={false} />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#898781' }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} interval={0} />
            <YAxis tickFormatter={(v) => fmtPct(v, 0)} tick={{ fontSize: 10, fill: '#898781' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'antes' ? 'Média até 19/07' : '20/07')} />
            <Bar dataKey="antes" name="antes" fill="#B9C2D6" radius={[3, 3, 0, 0]} maxBarSize={56} />
            <Bar dataKey="dia20" name="dia20" fill="#C1443B" radius={[3, 3, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
