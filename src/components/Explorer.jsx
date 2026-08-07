import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { dims, dailySeries, shareOfSpend, fmtPct, DEFAULT_SEGMENT } from '../lib/data'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>ROAS (receita ÷ gasto)</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value.toFixed(2)}</div>
      ))}
    </div>
  )
}

export default function Explorer() {
  const [filters, setFilters] = useState(DEFAULT_SEGMENT)

  const segSeries = useMemo(() => dailySeries(filters), [filters])
  const restSeries = useMemo(() => dailySeries({ inst: 'Todas', estado: 'Todos', canal: 'Todos', curso: 'Todos' }), [])

  const merged = useMemo(() => {
    const restByDate = Object.fromEntries(restSeries.map((d) => [d.date, d]))
    return segSeries.map((s) => ({
      label: s.date.slice(8, 10) + '/07',
      selecionado: s.roas,
      conta_toda: restByDate[s.date]?.roas ?? null,
    }))
  }, [segSeries, restSeries])

  const share = shareOfSpend(filters)

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="card">
      <div className="filter-row">
        <div className="filter-group">
          <label>Instituição</label>
          <select value={filters.inst} onChange={update('inst')}>
            <option>Todas</option>
            {dims.inst.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Estado</label>
          <select value={filters.estado} onChange={update('estado')}>
            <option>Todos</option>
            {dims.estado.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Canal</label>
          <select value={filters.canal} onChange={update('canal')}>
            <option>Todos</option>
            {dims.canal.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Curso</label>
          <select value={filters.curso} onChange={update('curso')}>
            <option>Todos</option>
            {dims.curso.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="legend-row">
        <span><span className="dot" style={{ background: '#F2664F' }} />Seleção atual</span>
        <span><span className="dot" style={{ background: '#B7C4E5' }} />Conta toda</span>
        <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          Seleção representa <strong style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>{fmtPct(share, 0)}</strong> do gasto total em 20/07
        </span>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={merged} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#2A2538" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8F99B2' }} axisLine={{ stroke: '#3A3548' }} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#8F99B2' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="conta_toda" name="Conta toda" stroke="#B7C4E5" strokeWidth={2} strokeDasharray="4 3" dot={false} />
            <Line type="monotone" dataKey="selecionado" name="Seleção" stroke="#F2664F" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
