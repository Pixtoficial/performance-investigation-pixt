import raw from '../data.json'

export const overall = raw.overall
export const detailed = raw.detailed
export const dims = raw.dims

const D20 = '2024-07-20'

export function fmtPct(v, digits = 1) {
  return (v * 100).toFixed(digits) + '%'
}
export function fmtBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function matches(row, filters) {
  return (
    (filters.inst === 'Todas' || row.inst === filters.inst) &&
    (filters.estado === 'Todos' || row.estado === filters.estado) &&
    (filters.canal === 'Todos' || row.canal === filters.canal) &&
    (filters.curso === 'Todos' || row.curso === filters.curso)
  )
}

// weighted daily series for a given filter set
export function dailySeries(filters) {
  const byDate = {}
  for (const r of detailed) {
    if (!matches(r, filters)) continue
    if (!byDate[r.date]) byDate[r.date] = { date: r.date, gasto: 0, revenue: 0 }
    byDate[r.date].gasto += r.gasto
    byDate[r.date].revenue += r.revenue
  }
  return Object.values(byDate)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((d) => ({ ...d, roas: d.gasto ? d.revenue / d.gasto : 0 }))
}

export function weightedAvg(rows, valueKey, weightKey = 'gasto') {
  let wsum = 0
  let vsum = 0
  for (const r of rows) {
    wsum += r[weightKey]
    vsum += r[valueKey] * r[weightKey]
  }
  return wsum ? vsum / wsum : 0
}

export function segmentVsRestFunnel(filters) {
  const seg = detailed.filter((r) => matches(r, filters))
  const rest = detailed.filter((r) => !matches(r, filters))
  const segBefore = seg.filter((r) => r.date !== D20)
  const segDay = seg.filter((r) => r.date === D20)
  const restBefore = rest.filter((r) => r.date !== D20)
  const restDay = rest.filter((r) => r.date === D20)

  const stage = (rows, key) => weightedAvg(rows, key)

  return {
    atc: {
      segBefore: stage(segBefore, 'atc'),
      segDay: stage(segDay, 'atc'),
      restBefore: stage(restBefore, 'atc'),
      restDay: stage(restDay, 'atc'),
    },
    ccvr: {
      segBefore: stage(segBefore, 'ccvr'),
      segDay: stage(segDay, 'ccvr'),
      restBefore: stage(restBefore, 'ccvr'),
      restDay: stage(restDay, 'ccvr'),
    },
    cvr: {
      segBefore: stage(segBefore, 'cvr'),
      segDay: stage(segDay, 'cvr'),
      restBefore: stage(restBefore, 'cvr'),
      restDay: stage(restDay, 'cvr'),
    },
  }
}

export function totalsForDate(date) {
  const rows = detailed.filter((r) => r.date === date)
  const gasto = rows.reduce((s, r) => s + r.gasto, 0)
  const revenue = rows.reduce((s, r) => s + r.revenue, 0)
  return { gasto, revenue, roas: gasto ? revenue / gasto : 0 }
}

export function shareOfSpend(filters, date = D20) {
  const rows = detailed.filter((r) => r.date === date)
  const total = rows.reduce((s, r) => s + r.gasto, 0)
  const seg = rows.filter((r) => matches(r, filters)).reduce((s, r) => s + r.gasto, 0)
  return total ? seg / total : 0
}

export const DEFAULT_SEGMENT = { inst: 'UFBRA', estado: 'SP', canal: 'Todos', curso: 'ADM' }
export const D20_DATE = D20

// revenue shortfall on D20 vs. what each (inst, estado, curso, canal) group would
// have produced at its own pre-period average ROAS
export function shortfallAnalysis(filters = DEFAULT_SEGMENT) {
  const groups = {}
  for (const r of detailed) {
    const key = `${r.inst}|${r.estado}|${r.curso}|${r.canal}`
    if (!groups[key]) groups[key] = { before: [], day: null }
    if (r.date === D20) groups[key].day = r
    else groups[key].before.push(r)
  }
  let totalShortfall = 0
  let segShortfall = 0
  for (const key in groups) {
    const g = groups[key]
    if (!g.day || !g.before.length) continue
    const avgRoas = g.before.reduce((s, r) => s + r.roas, 0) / g.before.length
    const expectedRevenue = g.day.gasto * avgRoas
    const shortfall = expectedRevenue - g.day.revenue
    totalShortfall += shortfall
    if (matches(g.day, filters)) segShortfall += shortfall
  }
  return {
    totalShortfall,
    segShortfall,
    segSharePct: totalShortfall ? segShortfall / totalShortfall : 0,
  }
}

export function overallMarginStats() {
  const before = overall.filter((d) => d.date !== D20)
  const avgBefore = before.reduce((s, d) => s + d.margin, 0) / before.length
  const day = overall.find((d) => d.date === D20)
  return { avgBefore, day20: day.margin, delta: day.margin - avgBefore }
}
