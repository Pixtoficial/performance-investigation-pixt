import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts'
import { shortfallContributors, spendShareByCombo, fmtBRL, fmtPct } from '../lib/data'

const HIGHLIGHT = 'UFBRA · SP · ADM'

function ShortfallTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--ink)' }}>{p.label}</div>
      <div style={{ color: 'var(--alert)' }}>Receita perdida: {fmtBRL(p.shortfall)}</div>
    </div>
  )
}

function ShareTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--ink)' }}>{p.label}</div>
      <div>{fmtPct(p.share, 0)} do gasto · {fmtBRL(p.gasto)}</div>
    </div>
  )
}

export function ShortfallRanking() {
  const { rows, total } = shortfallContributors(6)
  return (
    <div className="card">
      <div className="chart-title">Quem explica a receita perdida em 20/07</div>
      <div className="chart-subtitle">
        Shortfall = receita esperada (pela média histórica de ROAS de cada combo) menos receita real do dia.
        Total do dia: {fmtBRL(total)}.
      </div>
      <div style={{ width: '100%', height: 280, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 70, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="#2A2538" horizontal={false} />
            <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(v) => fmtBRL(v)} tick={{ fontSize: 10, fill: '#8F99B2' }} axisLine={{ stroke: '#463F5C' }} tickLine={false} />
            <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: '#8F99B2' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ShortfallTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="shortfall" radius={[0, 3, 3, 0]} maxBarSize={22}>
              {rows.map((r, i) => (
                <Cell key={i} fill={r.label === HIGHLIGHT ? '#F2664F' : '#463F5C'} />
              ))}
              <LabelList dataKey="shortfall" position="right" formatter={(v) => fmtBRL(v)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#9C9CB0' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function SpendShare() {
  const rows = spendShareByCombo().slice(0, 6)
  return (
    <div className="card">
      <div className="chart-title">Participação de cada combo no gasto de 20/07</div>
      <div className="chart-subtitle">UFBRA · SP · ADM concentra quase metade do orçamento do dia. Por isso, uma falha pontual nele derruba a conta inteira.</div>
      <div style={{ width: '100%', height: 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 50, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="#2A2538" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => fmtPct(v, 0)} tick={{ fontSize: 10, fill: '#8F99B2' }} axisLine={{ stroke: '#463F5C' }} tickLine={false} />
            <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: '#8F99B2' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ShareTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="share" radius={[0, 3, 3, 0]} maxBarSize={22}>
              {rows.map((r, i) => (
                <Cell key={i} fill={r.label === HIGHLIGHT ? '#F2664F' : '#463F5C'} />
              ))}
              <LabelList dataKey="share" position="right" formatter={(v) => fmtPct(v, 0)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#9C9CB0' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
