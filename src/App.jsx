import MarginTrend from './components/MarginTrend'
import Explorer from './components/Explorer'
import ChannelBreakdown from './components/ChannelBreakdown'
import FunnelChart from './components/FunnelChart'
import { ShortfallRanking, SpendShare } from './components/ImpactCharts'
import { fmtPct, fmtBRL, totalsForDate, shareOfSpend, shortfallAnalysis, overallMarginStats, beforePeriodLabel, DEFAULT_SEGMENT, D20_DATE } from './lib/data'

export default function App() {
  const margin = overallMarginStats()
  const d20 = totalsForDate(D20_DATE)
  const share = shareOfSpend(DEFAULT_SEGMENT)
  const shortfall = shortfallAnalysis(DEFAULT_SEGMENT)
  const beforeLabel = beforePeriodLabel()

  return (
    <>
      <nav className="topnav">
        <div className="inner">
          <span className="brand">Investigação de performance · Aquisição</span>
          <div className="links">
            <a href="#problema">O problema</a>
            <a href="#evidencias">Evidências</a>
            <a href="#conclusao">Conclusão</a>
            <a href="#causa-raiz">Causa raiz</a>
            <a href="#recomendacoes">Recomendações</a>
          </div>
        </div>
      </nav>

      <div className="wrap">
        <section id="problema" style={{ paddingTop: 56 }}>
          <div className="eyebrow">Parte 1 · O problema · 20 de julho de 2024</div>
          <h1>Em um único dia, a margem de lucro saiu de positiva para -5%. A história começa em uma única página que parou de converter.</h1>
          <p className="lede">
            A margem de lucro diária andava estável entre 1% e 4% ao longo de julho de 2024. No dia 20, ela virou -5%.
            O gasto não mudou, os canais de mídia não mudaram. As campanhas seguiram levando tráfego normalmente.
            Algo quebrou na página de destino de um curso específico, e o peso desse curso dentro do orçamento
            foi grande o suficiente para arrastar a conta inteira junto.
          </p>

          <div className="hero-flow">
            <div className="hf-block">
              <div className="hf-dates">{beforeLabel}</div>
              <div className="hf-num">{fmtPct(margin.avgBefore, 0)}</div>
              <div className="hf-caption">média da margem de lucro</div>
            </div>
            <div className="hf-arrow">→</div>
            <div className="hf-block">
              <div className="hf-dates">20/07</div>
              <div className="hf-num alert">{fmtPct(margin.day20, 0)}</div>
              <div className="hf-caption">margem de lucro no dia</div>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="label">Receita perdida · 20/07</div>
              <div className="value alert">-{fmtBRL(shortfall.totalShortfall)}</div>
              <div className="sub">vs. receita esperada pela média histórica</div>
            </div>
            <div className="kpi-card">
              <div className="label">Fatia do prejuízo · 20/07</div>
              <div className="value alert">{fmtPct(shortfall.segSharePct, 0)}</div>
              <div className="sub">UFBRA · SP · ADM sobre o total perdido</div>
            </div>
            <div className="kpi-card">
              <div className="label">Fatia do investimento · 20/07</div>
              <div className="value">{fmtPct(share, 0)}</div>
              <div className="sub">UFBRA · SP · ADM sobre o total investido</div>
            </div>
            <div className="kpi-card">
              <div className="label">Total investido · 20/07</div>
              <div className="value">{fmtBRL(d20.gasto)}</div>
              <div className="sub">receita: {fmtBRL(d20.revenue)} · ROAS {d20.roas.toFixed(2)}</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 32 }}>
            <div className="chart-title">Margem de lucro diária — julho de 2024</div>
            <div className="chart-subtitle">Barra vermelha = 20/07, o único dia fora do padrão observado no resto do mês.</div>
            <div style={{ marginTop: 16 }}>
              <MarginTrend />
            </div>
          </div>
        </section>

        <section id="evidencias">
          <div className="eyebrow neutral">Parte 2 · As evidências</div>
          <h2>O que os dados mostram, passo a passo</h2>
          <p className="body-text">
            Cruzando os dados, instituição, estado, canal e curso, a queda de ROAS em 20/07 aparece concentrada em
            um único combo: <strong>UFBRA · SP · ADM</strong>. Todos os outros cursos (Inglês, Excel,
            Liderança), o outro estado da mesma instituição (MG) e a outra instituição (UNIASP) mantiveram
            performance normal no dia. Três evidências mostram onde e como isso aconteceu.
          </p>

          <h3 style={{ marginTop: 32, marginBottom: 4 }}>2.1 — Não é a mídia: os três canais caem juntos, na mesma magnitude</h3>
          <p className="body-text">
            Se o problema fosse de uma plataforma de anúncio específica (leilão, conta bloqueada, mudança
            de algoritmo), o impacto seria diferente em cada canal. Aqui, Tiktok, Meta e Google Search caem
            de forma praticamente idêntica — sinal de que a causa está do lado do destino (a landing page),
            não do lado da mídia.
          </p>
          <ChannelBreakdown />

          <h3 style={{ marginTop: 32, marginBottom: 4 }}>2.2 — A quebra é no Add to Cart, não no checkout</h3>
          <p className="body-text">
            O gasto seguiu normal (R$14.227, dentro da média). O Add to Cart caiu praticamente pela metade
            (18% → 9%). O Checkout CVR — a etapa seguinte, de pagamento — ficou estável (33% → 33%). Quem
            chegava ao checkout continuava comprando; o vazamento acontece entre o clique no anúncio e a
            adição do curso ao carrinho. Isso aponta para algo na própria página — bug, lentidão, erro de
            carregamento, mudança de conteúdo ou preço, CTA quebrado — e não para o pagamento.
          </p>
          <FunnelChart />

          <h3 style={{ marginTop: 32, marginBottom: 4 }}>2.3 — Por que isso derrubou a conta inteira</h3>
          <p className="body-text">
            UFBRA · SP · ADM sozinho representa {fmtPct(share, 0)} do gasto do dia — quase metade do
            orçamento diário. Com essa concentração, uma falha pontual em uma única página foi suficiente
            para explicar {fmtPct(shortfall.segSharePct, 0)} de toda a receita perdida no dia, e derrubar
            a margem da conta inteira de positiva para -5%.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ShortfallRanking />
            <SpendShare />
          </div>
        </section>

        <section id="conclusao">
          <div className="eyebrow ok">Parte 3 · Conclusão</div>
          <h2>A história completa</h2>
          <p className="body-text">
            A queda da margem de lucro em 20/07 não veio de um problema de mídia, de leilão ou de uma
            instabilidade geral da conta. Ela se deu devido a uma instituição específica (UFBRA), em um
            estado específico (SP), em um curso específico (ADM) — muito provavelmente por causa de um
            problema técnico ou de conteúdo na própria landing page desse produto, não nas campanhas em si.
          </p>
          <p className="body-text">
            Isso porque os três canais de tráfego se mantiveram estáveis entre si, caindo igualmente, sem
            que houvesse um declínio isolado em um canal específico — o que descarta causa de mídia. E
            porque a quebra aconteceu na taxa de Add to Cart, que caiu drasticamente, enquanto o Checkout
            CVR seguiu normal — sinalizando um problema no topo do funil, na própria página do produto, e
            não no processo de pagamento.
          </p>
          <p className="body-text">
            O motivo de essa falha pontual ter derrubado a margem da conta inteira é concentração de
            budget: esse único combo responde por quase metade do gasto diário, então uma quebra nele tem
            o mesmo peso que uma quebra na conta toda.
          </p>
          <p className="body-text">
            Investigação da causa raiz do curso Excel (queda menor, dentro do que pode ser ruído normal)
            fica como próximo passo, mas não muda a conclusão principal: o evento de 20/07 é explicado por
            UFBRA · SP · ADM.
          </p>
        </section>

        <section id="causa-raiz">
          <div className="eyebrow">Parte 4 · Causa raiz e recomendações</div>
          <h2>Hipóteses</h2>
          <p className="body-text">
            Nenhuma destas foi confirmada em sistema — são as explicações mais prováveis dado o padrão
            observado, em ordem de probabilidade.
          </p>
          <div className="hyp-list">
            <div className="hyp-item">
              <h3>Falha técnica na landing page do curso ADM (SP)</h3>
              <p>
                Bug de carregamento, formulário quebrado, imagem ou preço não renderizando. Explica por
                que o impacto é idêntico nos três canais — todos apontam para a mesma página — e por que
                o checkout, que já não depende mais da LP, seguiu normal.
              </p>
            </div>
            <div className="hyp-item">
              <h3>Alteração de conteúdo, oferta ou preço na véspera</h3>
              <p>
                Um deploy, edição de CMS ou ajuste de copy feito entre 19/07 e 20/07 nessa página
                específica pode ter prejudicado a proposta de valor ou quebrado algum elemento visual.
              </p>
            </div>
            <div className="hyp-item">
              <h3>Instabilidade de hospedagem/CDN isolada a essa URL</h3>
              <p>
                Menos provável, mas explicaria uma degradação pontual e temporária sem qualquer mudança
                de configuração de mídia.
              </p>
            </div>
          </div>
        </section>

        <section id="recomendacoes" style={{ borderBottom: 'none' }}>
          <div className="eyebrow ok">Próximos passos</div>
          <h2>Recomendações</h2>
          <div className="rec-list">
            <div className="rec-item">
              <span className="tag">Imediato</span>
              <p>Checar logs de erro, uptime e Search Console da landing page de ADM/SP no dia 20/07, e revisar o histórico de deploys/edições de CMS entre 19 e 20/07.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Imediato</span>
              <p>Validar ao vivo o disparo do evento de Add to Cart nessa página — descartar (ou confirmar) que parte da queda é tracking, não apenas comportamento real de usuário.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Curto prazo</span>
              <p>Enquanto a causa não é confirmada, reduzir o budget do segmento afetado e realocar para os cursos que mantiveram performance normal no período.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Estrutural</span>
              <p>Um único cruzamento institution × estado × curso concentrando ~41% do budget diário é um risco por si só. Definir caps de concentração por segmento e alertas automáticos de queda de Add to Cart acima de um limiar, antes que o gasto continue fluindo sem controle.</p>
            </div>
          </div>
        </section>

        <section id="explorar" style={{ borderBottom: 'none' }}>
          <div className="eyebrow neutral">Apêndice</div>
          <h2>Explore os dados você mesmo</h2>
          <p className="body-text">
            Ferramenta de conferência: troque instituição, estado, canal e curso e compare o ROAS diário da
            seleção contra o da conta toda. Nenhum outro cruzamento mostra o mesmo padrão de queda em 20/07.
          </p>
          <Explorer />
        </section>

        <footer>
          <span>Dados fictícios · teste técnico de performance</span>
          <span>Preparado para revisão do CMO</span>
        </footer>
      </div>
    </>
  )
}
