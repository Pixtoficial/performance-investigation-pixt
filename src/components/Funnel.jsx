import { segmentVsRestFunnel, fmtPct, DEFAULT_SEGMENT } from '../lib/data'

const STAGES = [
  { key: 'atc', name: 'Add to cart', hint: 'tráfego → carrinho' },
  { key: 'ccvr', name: 'Checkout CVR', hint: 'carrinho → checkout concluído' },
  { key: 'cvr', name: 'CVR geral', hint: 'tráfego → venda' },
]

export default function Funnel() {
  const f = segmentVsRestFunnel(DEFAULT_SEGMENT)
  return (
    <div className="funnel-grid">
      {STAGES.map((s) => {
        const d = f[s.key]
        const delta = d.segDay / d.segBefore - 1
        return (
          <div className="funnel-stage" key={s.key}>
            <div className="stage-name">{s.name} <span style={{ color: 'var(--muted)' }}>— {s.hint}</span></div>
            <div className="funnel-row">
              <span className="k">UFBRA/SP/ADM · média até 19/07</span>
              <span className="v">{fmtPct(d.segBefore)}</span>
            </div>
            <div className="funnel-row affected">
              <span className="k">UFBRA/SP/ADM · 20/07</span>
              <span className="v">{fmtPct(d.segDay)} ({delta >= 0 ? '+' : ''}{fmtPct(delta, 0)})</span>
            </div>
            <div className="funnel-row">
              <span className="k">Resto da conta · 20/07</span>
              <span className="v">{fmtPct(d.restDay)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
